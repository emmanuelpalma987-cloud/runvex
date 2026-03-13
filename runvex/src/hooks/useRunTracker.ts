import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

export interface RunData {
  distanciaKm: number; tiempoSegundos: number;
  velocidadActual: number; velocidadPromedio: number;
  pasos: number; bpmSimulado: number; calorias: number;
  elevacion: number;
  coordenadas: { latitude: number; longitude: number; altitude?: number }[];
  corriendo: boolean;
}

export function useRunTracker() {
  const [datos, setDatos] = useState<RunData>({
    distanciaKm:0, tiempoSegundos:0, velocidadActual:0,
    velocidadPromedio:0, pasos:0, bpmSimulado:72,
    calorias:0, elevacion:0, coordenadas:[], corriendo:false,
  });
  const [permisoConcedido, setPermisoConcedido] = useState(false);
  const timer   = useRef<ReturnType<typeof setInterval>|null>(null);
  const locSub  = useRef<Location.LocationSubscription|null>(null);
  const pedSub  = useRef<{remove:()=>void}|null>(null);
  const dist    = useRef(0);
  const tiempo  = useRef(0);
  const pasos   = useRef(0);
  const coords  = useRef<{latitude:number;longitude:number;altitude?:number}[]>([]);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({status}) => setPermisoConcedido(status==='granted'));
    return () => stop();
  }, []);

  const haversine = (a:number,b:number,c:number,d:number) => {
    const R=6371, dLat=(c-a)*Math.PI/180, dLon=(d-b)*Math.PI/180;
    const x=Math.sin(dLat/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
  };

  const iniciarCarrera = useCallback(async () => {
    if (!permisoConcedido) {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status!=='granted') return;
      setPermisoConcedido(true);
    }
    dist.current=0; tiempo.current=0; pasos.current=0; coords.current=[];
    setDatos(p=>({...p,distanciaKm:0,tiempoSegundos:0,pasos:0,calorias:0,coordenadas:[],corriendo:true}));

    timer.current = setInterval(()=>{
      tiempo.current+=1;
      const bpm=130+Math.floor(Math.random()*20-10);
      setDatos(p=>({
        ...p,
        tiempoSegundos:tiempo.current,
        bpmSimulado:bpm,
        velocidadPromedio:tiempo.current>0?(dist.current/tiempo.current)*3600:0,
        calorias:Math.floor(dist.current*60),
      }));
    },1000);

    locSub.current = await Location.watchPositionAsync(
      {accuracy:Location.Accuracy.BestForNavigation,distanceInterval:5,timeInterval:2000},
      loc=>{
        const {latitude,longitude,altitude,speed}=loc.coords;
        const prev=coords.current;
        if(prev.length>0){
          const last=prev[prev.length-1];
          const d=haversine(last.latitude,last.longitude,latitude,longitude);
          if(d>0.003) dist.current+=d;
        }
        coords.current=[...prev,{latitude,longitude,altitude:altitude??0}];
        setDatos(p=>({
          ...p,
          distanciaKm:dist.current,
          velocidadActual:speed?speed*3.6:p.velocidadActual,
          coordenadas:coords.current,
          corriendo:true,
        }));
      }
    );

    const avail=await Pedometer.isAvailableAsync();
    if(avail){
      pedSub.current=Pedometer.watchStepCount(r=>{
        pasos.current=r.steps;
        setDatos(p=>({...p,pasos:r.steps}));
      });
    }
  },[permisoConcedido]);

  const pausarCarrera = useCallback(()=>{
    if(timer.current) clearInterval(timer.current);
    locSub.current?.remove();
    pedSub.current?.remove();
    setDatos(p=>({...p,corriendo:false}));
  },[]);

  const terminarCarrera = useCallback(()=>{
    pausarCarrera();
    return {
      distanciaKm:dist.current, tiempoSegundos:tiempo.current,
      velocidadPromedio:tiempo.current>0?(dist.current/tiempo.current)*3600:0,
      pasos:pasos.current, calorias:Math.floor(dist.current*60),
      coordenadas:coords.current,
    };
  },[pausarCarrera]);

  const stop=()=>{
    if(timer.current) clearInterval(timer.current);
    locSub.current?.remove(); pedSub.current?.remove();
  };

  return {datos,iniciarCarrera,pausarCarrera,terminarCarrera,permisoConcedido};
}

export const formatTiempo=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
export const formatPace=(km:number,s:number)=>{
  if(!km) return '--:--';
  const p=s/km;
  return `${Math.floor(p/60)}:${String(Math.floor(p%60)).padStart(2,'0')} min/km`;
};

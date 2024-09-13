'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Banner from '@/components/banner/page';
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Home() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const circleReferenced = useRef<SVGCircleElement | null>(null);
  const centerTransformOrigin = 'center center';
  const circleLength = 2 * Math.PI * 49;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const circle = circleReferenced.current;
      gsap.set(circle, {
        rotate: -90,
        transformOrigin: centerTransformOrigin,
      });
      gsap.set(circle, {
        strokeDasharray: circleLength,
        strokeDashoffset: circleLength,
      });
      const drawAnimation = ScrollTrigger.create({
        trigger: section,
        start: 'top 90%',
        end: 'top 20%',
        scrub: 50,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          let offset = circleLength * (1 - progress);
          offset = Math.min(offset, circleLength);
          gsap.to(circle, {
            strokeDashoffset: offset,
            ease: 'power1',
            overwrite: true,
            duration: 0.3,
          });
          if (progress === 1) {
            console.log('circle drawn ');
          }
        },
      });
      return () => {
        drawAnimation.kill();
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.kill();
        });
      };
    },
    { scope: sectionRef }
  );
  return (
    <>
   
    <section className="h-[200vh] flex flex-col justify-center items-center w-full">
      <div className="h-[100vh] text-[30px] py-5">Scroll Down to draw an svg</div>
      <div ref={sectionRef} className=" h-[100vh] ">
        <svg
          viewBox="0 0 100 100"
          width="300px"
          height="300px"
          className="svg-circle"
        >
          <circle
            cx="50"
            cy="50"
            r="49"
            ref={circleReferenced}
            fill="transparent"
            stroke="blue"
            strokeWidth="1"
          />
        </svg>
      </div>
    </section>
      <div className='flex justify-center items-center'>
        <div className='pb-[1000px]'>
          <Banner />
        </div>
      </div>
    </>
  );
}

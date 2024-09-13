'use client'
import { useGSAP } from '@gsap/react'
import { motion, useAnimation } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const Banner = () => {
  const [isFirstSectionVisible, setIsFirstSectionVisible] = useState(true)
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionReference = useRef(null)
  const gReference = useRef(null)
  const circleReference = useRef(null)
  const previousScrollPosition = useRef(0)
  const contentControls = useAnimation()
  const content2Controls = useAnimation()
  const circleLength = 2 * Math.PI * 49
  const centerTransformOrigin = 'center center'
  const transitionCss = 'all 0.3s ease-in'
  useGSAP(
    () => {
      const section = sectionReference.current
      const circle = circleReference.current
      const text = document.querySelector('.text-inside-circle')
      gsap.set(text, { opacity: 0 })
      const gElement = gReference.current
      gsap.set(gElement, {
        rotate: -90,
        transformOrigin: centerTransformOrigin
      })
      gsap.set(circle, {
        strokeDasharray: circleLength,
        strokeDashoffset: circleLength
      })
      // const parentElement = circle?.parentNode?.parentNode?.parentNode?.parentNode
      // scrolltrigger to draw the circle on forword scrolling and erase it on backword scrolling
      const drawAnimation = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 20,
        markers: false,
        onUpdate: self => {
          const progress = self.progress
          if (self.direction === -1) {
            gsap.set(gElement, {
              rotate: -90,
              transformOrigin: centerTransformOrigin
            })
            gsap.to(text, { opacity: 0, duration: 0.3 })

            void contentControls.start({
              opacity: 0,
              transition: { duration: 0.3, ease: 'easeInOut' }
            })
            if (progress === 0) {
              previousScrollPosition.current = 0
            }
            let offset = circleLength * (1 - progress)
            offset = Math.min(offset, circleLength)
            gsap.to(circle, {
              strokeDashoffset: offset,
              ease: 'none',
              overwrite: true,
              duration: 0.3
            })
          }
          if (self.direction === 1) {
            let offset = circleLength * (1 - progress)
            offset = Math.min(offset, circleLength)
            gsap.to(circle, {
              strokeDashoffset: offset,
              ease: 'none',
              overwrite: true,
              duration: 0.3
            })
            if (progress === 1) {
              setHasAnimated(true)
              previousScrollPosition.current = window.scrollY
              gsap.to(text, { opacity: 1, duration: 0.3, delay: 0.6 })

              void contentControls.start({
                opacity: 1,
                transition: { duration: 0.3, ease: 'easeInOut', delay: 0.6 }
              })
            }
          }
        },
        onLeaveBack: () => {
          gsap.to(circle, {
            strokeDashoffset: circleLength,
            ease: 'none',
            overwrite: true,
            duration: 0.2
          })
          previousScrollPosition.current = 0
        }
      })
      // Second ScrollTrigger to pin the Parent div with all content
      // const pinElement = parentElement as gsap.DOMTarget | null | undefined
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 20%',
        pin: true,
        pinSpacing: true,
        markers: false,
        scrub: false,
        end: '+=730'
      })
      return () => {
        // Clean up GSAP instances
        drawAnimation.kill()
        pinTrigger.kill()
        ScrollTrigger.getAll().forEach(trigger => {
          trigger.kill()
        })
      }
    },
    { scope: sectionReference }
  )
  useGSAP(() => {
    const section = sectionReference.current
    const circle = circleReference.current
    const gElement = gReference.current
    // ScrollTrigger to make the pinned circle half on forword scrolling and full on backword scrolling
    ScrollTrigger.create({
      trigger: section,
      start: 'top 20%',
      end: '+=680',
      scrub: 5,
      markers: false,
      onUpdate: self => {
        const newProperties = previousScrollPosition.current + 70

        // half the circle on forword scrolling
        if (
          hasAnimated &&
          window.scrollY > newProperties &&
          self.direction === 1
        ) {
          if (window.scrollY > newProperties && hasAnimated) {
            void content2Controls.start({
              opacity: 0,
              transition: { duration: 0.5, ease: 'easeInOut' }
            })
          }
          gsap.set(gElement, {
            rotate: -180,
            transformOrigin: centerTransformOrigin
          })

          const offset = Math.min(
            (circleLength * self.progress) / 2,
            circleLength / 2
          )
          if (offset === circleLength / 2) {
            setIsFirstSectionVisible(false)
            void contentControls.start({
              opacity: 0,
              transition: { duration: 0.5, ease: 'easeIn' }
            })
            void content2Controls.start({
              opacity: 1,
              transition: { duration: 1, ease: 'easeInOut', delay: 0.7 }
            })
          }
          gsap.to(circle, {
            strokeDashoffset: offset,
            ease: 'none',
            overwrite: true,
            duration: 0.3
          })
        } else if (hasAnimated && self.direction === -1) {
          const offset = Math.min(
            (circleLength * self.progress) / 2,
            circleLength / 2
          )
          setIsFirstSectionVisible(true)
          void contentControls.start({
            opacity: 1,
            transition: { duration: 0, ease: 'easeIn' }
          })
          gsap.to(circle, {
            strokeDashoffset: offset,
            ease: 'none',
            overwrite: true,
            duration: 0.3
          })
        }
      }
    })
  }, [circleLength, hasAnimated])

  return (
    <>
      <section
        ref={sectionReference}
        className="modul-section  next-section flex justify-center xl:mt-[-8rem] xl2:mt-[-11rem] xl4:h-[768px] xl5:mt-[0rem] xl5:h-[1080px] xl3:mt-[-13rem]"
      >
        <div className="flex flex-col ">
          <hr
            className={`hr-line z-[9999] block h-px  border bg-[#DFDFDF]  md:ml-[-2rem] md:w-[546px] lg:w-[930px] xl:mt-[0rem] xl:w-[672px] custom:ml-[-2rem] custom:w-[720px] xl4:mt-[6px] xl4:w-[1178px] xl5:mt-[-3rem] xl5:ml-[-9rem] xl5:w-[1653px] ${
              isFirstSectionVisible ? 'xlprop' : 'xlprop2'
            }`}
          />
          <div
            className={`flex ${
              isFirstSectionVisible
                ? 'firstclass-qb flex-row justify-start gap-[6rem]'
                : 'sss flex-col justify-between'
            } xl4:min-w-[1161.33px] xl5:min-w-[1346px]`}
          >
            <svg
              viewBox="0 0 100 100"
              width="720px"
              height="720px"
              className="svg-circle xl5:ml-[-8.3rem]"
            >
              <g
                ref={gReference}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  ref={circleReference}
                  fill="transparent"
                  stroke="blue"
                  strokeWidth="1"
                />
              </g>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="blue"
                className="text-inside-circle"
                style={{ transition: transitionCss }}
              >
                UPS Anlæg
              </text>
            </svg>

            <div
              className={`firstsectionvisible-ups mt-[10rem] xs:mt-0 sm:mt-0 lg:mt-[4rem] xl:mt-[4rem] xl5:mt-[7rem]  ${
                isFirstSectionVisible ? 'visible' : 'hidden'
              }   
        `}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={contentControls}
                style={{ transition: transitionCss }}
              >
                <h1 className="modul-head text-[84px] leading-[70px] text-blue-700">
                  Modul-
                  <br />
                  opbygget
                </h1>
                <h3 className="modul-subhead py-5 text-[37px] text-blue-600">
                  UPS anlæg
                </h3>
                <div>
                  <p className="modul-para1 font-Montserrat-Light w-[433px] text-[16px]">
                    I en verden af teknologi, som udvikler sig hurtigere end de
                    fleste kan nå at tilpasse sig til, har fleksibilitet i
                    virksomheders infrastruktur, herunder UPS anlæg aldrig været
                    mere afgørende.
                  </p>
                  <p className="modul-para2 font-Montserrat-Light w-[433px] py-5 text-[16px]">
                    Aktionærer og andre interessenter kræver, en veldefineret
                    redundant og fuldt ud understøttet infrastruktur, da
                    millioner af kroner er på spil, hvis de forkerte valg
                    træffes.
                  </p>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={content2Controls}
              style={{ transition: transitionCss }}
              className={`m-wrapper xl4:mt-[-13.5rem] xl5:mt-[-22rem] ${
                isFirstSectionVisible ? 'hidden' : 'visible'
              }`}
              data-aos-anchor-placement="top-bottom"
            >
              <div className="m-subwrapper flex justify-between ">
                <div className="">
                  <div className="flex-col xs:flex  xl:flex">
                    <div className="m-para-wrapper">
                      <p className="m-para1 xl5:w-[432px]">
                        <span className="m-para1-subhead">
                          Derfor er UPS anlæg
                        </span>{' '}
                        i høj grad blevet standardudstyr i de fleste
                        virksomheders infrastruktur, og kravene til anlæggene i
                        dag er, udover at de skal være driftsstabile:
                      </p>
                      <div>
                        <ul className="modulo-ul-list">
                          <li>Et modulært design = en bæredygtig tilgang</li>
                          <li>
                            Høje virkningsgrader = lav påvirkning af miljøet
                          </li>
                          <li>Fleksibelt og servicevenligt = høj MTTR</li>
                          <li>Robust & fejltolerant = høj MTBF</li>
                        </ul>
                        <ul className="modulo-ul-list-mob hidden md:block lg:hidden">
                          <li>Et bæredygtig modulært design</li>
                          <li>Lav påvirkning af miljøet</li>
                          <li>Fleksibelt og servicevenligt = høj MTTR</li>
                          <li>Robust & fejltolerant = høj MTBF</li>
                        </ul>
                      </div>
                      <p className="m-para2 block w-[432px] xs:hidden sm:hidden md:hidden lg:block custom:hidden">
                        <span className="m-para2-subhead">
                          I det følgende indhold
                        </span>{' '}
                        vil vi guide jer gennem de mange overvejelser der går
                        forud for, at investere I et UPS anlæg, samt sikre, at I
                        er klædt godt på i forhold til, at vælge en bæredygtig
                        løsning.
                      </p>
                      <p className="m-para-2 hidden w-[432px] xs:hidden sm:hidden md:hidden lg:block custom:hidden xl5:hidden">
                        <span className="m-para2-subhead">I det følgende</span>{' '}
                        guider vi jer gennem udvælgelsen af et UPS anlæg.
                      </p>
                      <div
                        className="items-center pt-[3rem] xs:hidden xs:pt-[1rem] sm:hidden md:mt-[1.5rem] md:hidden lg:mt-[0.5rem] lg:flex lg:pl-[unset] xl:mt-[0rem] xl:flex custom:mt-[2.5rem] custom:!hidden xl4:mt-[1rem] xl4:flex xl5:mt-[1rem]
                     xl5:flex xl5:pt-[1rem]"
                      >
                        <span className="link-circle">
                          
                        </span>
                        <p className="banner-p py-4 text-[14.61px]">
                          Spring over og gå direkte til UPS anlæg....
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
               
              </div>
              <div
                className="inline-flex flex-row items-center xs:hidden xs:pt-[1rem] md:mt-[1.5rem] md:inline-flex lg:hidden lg:pl-[unset] xl:mt-[0rem] custom:mt-[2.5rem] custom:flex custom:hidden xl4:mt-[1rem]
                         xl5:mt-[1rem] xl5:pt-[1rem]"
              >
                <span className="link-circle">
                  <Image
                    className="mr-2 h-[40px] w-[40px]"
                    src="/ff-page/3x/arro.png"
                    alt="li"
                    height={40}
                    width={40}
                  />
                </span>
                <p className="ups-banner-dwld-btn py-4 text-[14.61px]">
                  Spring over og gå direkte til UPS anlæg....
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
     
    </>
  )
}
export default Banner

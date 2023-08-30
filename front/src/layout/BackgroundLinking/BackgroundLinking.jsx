import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useEffect} from "react";

const BackgroundLinking = React.memo(({ style }) => {

    const particlesInit = useCallback(async engine => {
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        // await console.log(container);
    }, []);
    
    return (
        <Particles
            style={{ zIndex: 1}}
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "#000000",
                    },
                },
                backgroundMask: {
                    composite: "destination-out",
                    cover: {
                        color: {
                            value: "#ffffff"
                        },
                        opacity: 1,
                    },
                    enable: false
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "connect",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        connect: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    bounce: {
                        horizontal: {
                            random: {
                                enable: true,
                                minimumValue: 0.5
                            },
                            value: 1
                        },
                        vertical: {
                            random: {
                                enable: true,
                                minimumValue: 0.1
                            },
                            value: 1
                        }
                    },
                    color: {
                        value: "#ffffff",
                        // value: "#ffd27d",
                    },

                    collisions: {
                        absorb: {
                            speed: 2
                        },
                        bounce: {
                            horizontal: {
                                random: {
                                    enable: false,
                                    minimumValue: 0.1
                                },
                                value: 1
                            },
                            vertical: {
                                random: {
                                    enable: false,
                                    minimumValue: 0.1
                                },
                                value: 1
                            }
                        },
                        enable: false,   
                        maxSpeed: 50,
                        mode: "bounce",
                        overlap: {
                            enable: true,
                            retries: 0
                        }


                    },
                    groups: {},
                    move: {
                        angle: {
                            offset: 0,
                            value: 90
                        },
                        attract: {
                            distance: 200,
                            enable: false,
                            rotate: {
                                x: 3000,
                                y: 3000
                            }
                        },
                        center: {
                            x: 200,
                            y: 20,
                            mode: "percent",
                            radius: 0
                        },
                        decay: 0,
                        distance: {},
                        direction: "none",
                        drift: 0,
                        enable: true,
                        gravity: {
                            acceleration: 9.81,
                            enable: false,
                            inverse: false,
                            maxSpeed: 5
                        },
                        path: {
                            clamp: true,
                            delay: {
                                random: {
                                    enable: true,
                                    minimumValue: 0.1
                                },
                                value: 1
                            },
                            enable: false,
                            options: {}
                        },
                        // outModes: {
                        //     default: "destroy",
                        //     bottom: "destroy",
                        //     left: "destroy",
                        //     right: "destroy",
                        //     top: "destroy"
                        // },
                        random: true,
                        size: true,
                        speed: { min: 0.01, max: 0.4 },
                        spin: {
                            acceleration: 0,
                            enable: false
                        },
                        straight: false,
                        trail: {
                            enable: true,
                            length: 2,
                            fill: {
                                color: {
                                    value: "#000000"
                                }
                            }
                        },
                        vibrate: false,
                        warp: false
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.3,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 0.1, max: 1 },
                        random: {
                            enable: true,
                            minimumValue: 0.5
                        },
                        anim: {
                            enable: true,
                            speed: { min: 0, max: 10 },
                            size_min: 3,
                            sync: false
                        }
                    },
                },
                detectRetina: true,
            }}

        />
    )
});

export default BackgroundLinking;

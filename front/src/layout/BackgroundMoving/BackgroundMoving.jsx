import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useEffect } from "react";

function BackgroundMoving() {
    const particlesInit = useCallback(async engine => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
    }, []);

    useEffect(() => {
        const originalConsoleLog = console.log;

        // Override console.log with an empty function
        console.log = () => { };

        return () => {
            // Restore the original console.log function when the component unmounts
            console.log = originalConsoleLog;
        };
    }, []);

    return (
        <Particles
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
                            value: "#fff"
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
                            mode: "bubble",
                            parallax: {
                                enable: true,
                                force: 100
                            },
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        bubble: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
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
                    color: {
                        value: "#000000",
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
                            enable: false,
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
                            maxSpeed: 50
                        },
                        path: {
                            clamp: true,
                            delay: {
                                random: {
                                    enable: false,
                                    minimumValue: 0
                                },
                                value: 0
                            },
                            enable: false,
                            options: {}
                        },
                        outModes: {
                            default: "destroy",
                            bottom: "destroy",
                            left: "destroy",
                            right: "destroy",
                            top: "destroy"
                        },
                        random: false,
                        size: true,
                        speed: 200,
                        spin: {
                            acceleration: 0,
                            enable: false
                        },
                        straight: false,
                        trail: {
                            enable: true,
                            length: 9,
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
                        value: 0.9,
                    },
                    shape: {
                        type: "square",
                    },
                    size: {
                        value: { min: 0.1, max: 1 },
                        anim: {
                            enable: true,
                            speed: { min: 0.1, max: 1 },
                            startValue: "min",
                            destroy: "max",
                            minimumValue: 100, // Minimum size of the particle
                            maximumValue: 500, // Maximum size of the particle (the size at the end of its lifetime)
                            // size_min: 4,
                            sync: false
                        }
                    },
                },
                emitters: {
                    autoPlay: true,
                    fill: true,
                    life: {
                        wait: false
                    },
                    rate: {
                        quantity: { min: 5, max: 20 },
                        delay: { min: 0.3, max: 0.5 }
                    },
                    shape: {
                        type: "square",
                    },
                    radius: 500,
                    startCount: 100,
                    size: {
                        mode: "percent",
                        height: 1000,
                        width: 1000
                    },
                    direction: "none",
                    particles: {},
                    position: {
                        x: 50,
                        y: 50
                    },
                    spawnColor: {
                        value: "#ffffff",
                    }
                },
                detectRetina: true,
            }}

        />
    )
}

export default BackgroundMoving;

import { Variants } from "framer-motion";

/**
 * PBank Motion System
 * 
 * Standardized animation variants to ensure 60FPS fluidity and consistent physics.
 * Optimized for GPU acceleration (using transform/opacity only).
 */

export const MotionSystem = {
    // Page Transitions - Revolut Style 3D Push
    pageTransition: {
        initial: {
            opacity: 0,
            scale: 0.96, // Slight zoom out
            y: 10,
            filter: 'blur(4px)'
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                // Spring physics for "alive" feel
                type: "spring",
                damping: 25,
                stiffness: 180,
                mass: 0.8
            }
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            filter: 'blur(4px)',
            transition: {
                duration: 0.25,
                ease: "easeInOut"
            }
        }
    } as Variants,

    // Advanced Hardware-accelerated Card Hover
    cardHover: {
        rest: { scale: 1, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
        hover: {
            scale: 1.02,
            y: -4,
            boxShadow: "0px 10px 20px -5px rgba(0,0,0,0.1)",
            transition: { type: "spring", stiffness: 400, damping: 25 }
        },
        tap: { scale: 0.98, transition: { duration: 0.1 } }
    } as Variants,

    // Button Tap with Haptic trigger (logic handled in hook)
    buttonTap: {
        hover: { scale: 1.02, transition: { duration: 0.2 } },
        tap: {
            scale: 0.95,
            transition: { type: "spring", stiffness: 500, damping: 15 }
        }
    } as Variants,

    // List Item Stagger
    listContainer: {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.05
            }
        }
    } as Variants,

    listItem: {
        hidden: { opacity: 0, x: -10, y: 10 },
        show: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 280,
                damping: 24
            }
        }
    } as Variants,

    // Modal Overlay
    modalOverlay: {
        hidden: { opacity: 0, backdropFilter: "blur(0px)" },
        visible: {
            opacity: 1,
            backdropFilter: "blur(8px)",
            transition: { duration: 0.3 }
        }
    } as Variants,

    // Modal Content
    modalContent: {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 350, damping: 25 }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 10,
            transition: { duration: 0.2 }
        }
    } as Variants,
    // Dropdown/Popover
    dropdown: {
        hidden: { opacity: 0, y: -8, scale: 0.96 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 30 }
        },
        exit: {
            opacity: 0,
            y: -8,
            scale: 0.96,
            transition: { duration: 0.2 }
        }
    } as Variants
};

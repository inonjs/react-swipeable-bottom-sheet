import React, { Component } from 'react';

import PropTypes from 'prop-types';

import SwipeableViews from 'react-swipeable-views';

import HeightUpdater from './HeightUpdater';

import ScrollToTop from './ScrollToTop';

const SwipeableBottomSheet = ({
    defaultOpen = false,
    fullScreen = false,
    marginTop = 0,
    overflowHeight = 0,
    overlay = true,
    scrollTopAtClose = true,
    shadowTip = true,
    swipeableViewsProps = {},
    topShadow = true,

    open, ...props }) => {

    const bodyElt = React.useRef(null)

    const [height, setHeight] = React.useState(window.innerHeight)
    const [isOpen, setIsOpen] = React.useState(isControlled ? open : open)

    const hiddenWhenClosed = overflowHeight === 0;
    const isControlled = open !== undefined;
    const hideShadows = hiddenWhenClosed && !isOpen;
    const index = isOpen ? 1 : 0;
    const maxHeight = height - marginTop;

    const onChangeIndex = (index: number) => {
        const open = index === 1;
        if (props.open === undefined) {
            setIsOpen(open)
        }
        if (props.onChange !== undefined) {
            props.onChange(open);
        }
    };

    const onTransitionEnd = () => {
        if (overflowHeight === 0) {
            bodyElt.scrollTop = 0;
        }

        if (swipeableViewsProps.onTransitionEnd) {
            swipeableViewsProps.onTransitionEnd();
        }
    };


    const styles = {
        root: {
            height: overflowHeight,
            position: 'fixed',
            bottom: 0,
            right: 0,
            left: 0,
            ...props.style
        },
        swiper: {
            root: {
                overflowY: 'initial',
                boxSizing: 'border-box',
                ...swipeableViewsProps.style
            },
            container: {
                boxSizing: 'border-box',
                ...topShadow && !hideShadows && {
                    boxShadow: 'rgba(0, 0, 0, 0.156863) 0px -6px 5px',
                },
                ...swipeableViewsProps.containerStyle
            },
            slide: {
                boxSizing: 'border-box',
                overflow: 'visible',
                marginBottom: -overflowHeight,
                ...swipeableViewsProps.slideStyle
            },
            bottomSlide: {
                marginBottom: overflowHeight,
            },
            body: {
                overflow: isOpen ? 'auto' : 'hidden',
                backgroundColor: 'white',
                height: fullScreen ? maxHeight : 'initial',
                maxHeight: maxHeight,
                ...props.bodyStyle
            }
        },
        overlay: {
            position: 'fixed',
            top: 0,
            right: 0,
            left: 0,
            height: height,
            transition: 'opacity 450ms',
            pointerEvents: 'none',
            backgroundColor: 'black',
            opacity: 0,
            ...isOpen && {
                opacity: 0.54,
                pointerEvents: 'auto',
            },
            ...props.overlayStyle
        },
        shadowTip: {
            position: 'fixed',
            height: 60,
            width: '200%',
            bottom: -60,
            left: '-50%',
            boxShadow: 'rgba(0, 0, 0, 0.7) 0px 0px 30px',
            transition: 'transform 450ms',
            transform: isOpen ? 'translateY(50px)' : 'translateY(0)'
        }
    };

    return (
        <div style={styles.root}>
            <HeightUpdater
                height={height}
                onHeightChange={height => setHeight(height)}
            />
            {overlay &&
                <div style={styles.overlay} onClick={() => onChangeIndex(0)} />
            }
            <SwipeableViews
                index={index}
                axis="y"
                enableMouseEvents
                onChangeIndex={onChangeIndex}
                {...props.swipeableViewsProps}
                onTransitionEnd={onTransitionEnd}
                style={styles.swiper.root}
                containerStyle={styles.swiper.container}
                slideStyle={styles.swiper.slide}
            >
                <div
                    ref={bodyElt}
                    style={styles.swiper.body}
                    className={`ReactSwipeableBottomSheet--${isOpen ? 'open' : 'closed'}`}
                >
                    {props.children}
                </div>
                <div style={styles.swiper.bottomSlide} />
            </SwipeableViews>
            {shadowTip && !hideShadows &&
                <div style={styles.shadowTip} />
            }
            {!isOpen && scrollTopAtClose && !hiddenWhenClosed && bodyElt.current &&
                <ScrollToTop element={() => bodyElt.current} />
            }
        </div>
    );
}

export default SwipeableBottomSheet;

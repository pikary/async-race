/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef } from 'react';
import './styles.scss';

interface WinnerBannerProps {
    winnerName: string;
    time: string;
    closeBanner: () => void;
}

function WinnerBanner({ winnerName, time, closeBanner }: WinnerBannerProps) {
    const bannerOuter = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleUnmount = (e: MouseEvent) => {
            if (e.target === bannerOuter.current) {
                closeBanner();
            }
        };
        bannerOuter.current?.addEventListener('click', handleUnmount);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
            bannerOuter.current?.removeEventListener('click', handleUnmount);
        };
    });
    return (
        <div className="winner" id="banner-outer" ref={bannerOuter}>
            <div
                className="winner__banner"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="winner__banner__inner">
                    <h2>
                        winner
                        <br />
                        {winnerName}
                        <br />
                        time: {time} s
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default WinnerBanner;

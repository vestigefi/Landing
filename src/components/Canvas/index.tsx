import { useEffect, useRef } from 'react';
// @ts-ignore
import { shape } from './lib';
import logo from '../../screenshots/logo.png';

function Canvas() {
    const ref = useRef(null!);

    useEffect(() => {
        if (ref.current) {
            shape.init(ref.current);
            shape.print('Vest Labs');
        }
    }, [ref.current]);

    return (
        <div
            ref={ref}
            className="relative flex justify-center items-center max-w-full"
            style={{ minHeight: 300, width: '100%' }}
        >
            <div className="w-full min-w-max flex justify-center items-center pb-6 pl-2" style={{ height: 300 }}>
                <img src={logo} className="absolute z-10 mx-auto opacity-90" />
            </div>
        </div>
    );
}

export default Canvas;

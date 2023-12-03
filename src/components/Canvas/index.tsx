import { useEffect, useRef } from 'react';
// @ts-ignore
import { shape } from './lib';

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
            className="relative flex justify-center items-center"
            style={{ minHeight: 300, width: '100%' }}
        />
    );
}

export default Canvas;

import React, { Suspense, lazy } from 'react';
const LazyMyMap = lazy(() => import('./MyMap')) ;

export default function AsynchMyMap(props){

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <LazyMyMap locations={props.locations}/>
            </Suspense>
        </div>
    );
}
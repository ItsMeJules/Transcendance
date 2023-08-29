import React from 'react';

type FadeLineProps = {
    marginTop: string;
};

const FadeLine: React.FC<FadeLineProps> = ({ marginTop }) => {
    return (
        <div className="fade-line-black" style={{ marginTop }}></div>
    );
};

export default FadeLine;
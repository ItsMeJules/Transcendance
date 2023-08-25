import React from 'react';

type FadeLineProps = {
    marginTop: string;
};

const FadeLine: React.FC<FadeLineProps> = ({ marginTop }) => {
    return (
        <div className="fade-line" style={{ marginTop }}></div>
    );
};

export default FadeLine;
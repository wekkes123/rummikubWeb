import React from 'react';
import { SketchPicker } from 'react-color';

function ColorPicker({ color, onChange }) {
    return (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 999 }}>
            <SketchPicker color={color} onChangeComplete={onChange} />
        </div>
    );
}

export default ColorPicker;

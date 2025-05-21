import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

function ThreePartDatePicker({ value, onChange, t }) {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // Sync internal state with external value when it changes
    useEffect(() => {
        if (value) {
            setDay(value.date().toString());
            setMonth((value.month() + 1).toString()); // month is 0-based
            setYear(value.year().toString());
        } else {
            setDay('');
            setMonth('');
            setYear('');
        }
    }, [value]);

    const handleChange = (part, val) => {
        const cleanVal = val.replace(/\D/g, ''); // Allow only numbers

        if (part === 'day') setDay(cleanVal);
        if (part === 'month') setMonth(cleanVal);
        if (part === 'year') setYear(cleanVal);

        const d = part === 'day' ? cleanVal : day;
        const m = part === 'month' ? cleanVal : month;
        const y = part === 'year' ? cleanVal : year;

        if (d && m && y) {
            const date = dayjs(`${y}-${m}-${d}`, 'YYYY-M-D');
            if (date.isValid() && !date.isAfter(dayjs())) {
                onChange(date);
            } else {
                onChange(null);
            }
        } else {
            onChange(null);
        }
    };

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <input
                type="number"
                min={1}
                max={31}
                placeholder={t('day')}
                value={day}
                onChange={e => handleChange('day', e.target.value)}
                style={{ width: '5rem' }}
            />
            <input
                type="number"
                min={1}
                max={12}
                placeholder={t('month')}
                value={month}
                onChange={e => handleChange('month', e.target.value)}
                style={{ width: '6rem' }}
            />
            <input
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                placeholder={t('year')}
                value={year}
                onChange={e => handleChange('year', e.target.value)}
                style={{ width: '6rem' }}
            />
        </div>
    );
}

export default ThreePartDatePicker;

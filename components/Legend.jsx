import { Legend } from '@tremor/react';
import React from 'react';

export default function LegendHero() {
  const [value, setValue] = React.useState('');
  return (
    <div className="mx-auto max-w-xs">
      <Legend
        className="mt-3"
        categories={['Category 1', 'Category 2', 'Category 3']}
        colors={['emerald', 'indigo', 'rose']}
        onClickLegendItem={(e) => {
          value === e ? setValue('') : setValue(e);
        }}
        activeLegend={value}
      />
    </div>
  )
}

const LoadingSpinner = () => (
  <div className='h-full w-full flex'>
    <div className='h-32 w-32 m-auto'>
      <svg viewBox='0 0 24 24' className='animate-spinner-linear-spin'>
        <circle
          cx='12'
          cy='12'
          r='9'
          stroke='url(#spinnerGradient)'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeDasharray='12 4'
          fill='none'
        />
        <defs>
          <linearGradient
            id='spinnerGradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#ffa400' stopOpacity='1' />
            <stop offset='100%' stopColor='#ffc300' stopOpacity='0.2' />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

export default LoadingSpinner;

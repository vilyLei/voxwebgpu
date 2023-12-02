#ifdef USE_FOG_COLOR_MAP
    getFogColorFromTexture2D();
#endif

#ifdef USE_FOG
    useFog( FragColor0 );
#endif 
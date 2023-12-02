#ifdef VOX_FOG_COLOR_MAP
    getFogColorFromTexture2D( VOX_FOG_COLOR_MAP );
#endif

#ifdef USE_FOG
    useFog( FragColor0 );
#endif 
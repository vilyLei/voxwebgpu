#ifdef USE_FOG
    
    #ifdef USE_FOG_COLOR_MAP
        fn getFogColorFromTexture2D(calcParam: CalcColor4Param) -> vec4<f32> {
            return textureSample(fogColorTexture, fogColorSampler, (fogParams[2].xy + calcParam.worldPos.xz) / fogParams[2].zw);
        }
    #endif
    fn useFog(color: ptr<function, vec4<f32>>, calcParam: CalcColor4Param) {
        var fogEnvColor = vec4<f32>(1.0);
        #ifdef USE_FOG_COLOR_MAP
            fogEnvColor = getFogColorFromTexture2D();
        #endif
        let fogDepth = -calcParam.viewPos.z;
        var fogColor = fogParams[1].xyz;
        
        var c4 = *color;
        #ifdef USE_FOG_COLOR_MAP
            fogColor *= fogEnvColor;
        #endif
        #ifdef USE_FOG_EXP2
            let fogDensity = fogParams[0].w;
            let fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
        #else
            let fogNear = fogParams[0].x;
            let fogFar = fogParams[0].y;
            let fogFactor = smoothstep( fogNear, fogFar, fogDepth );
        #endif
        #ifdef USE_BRIGHTNESS_OVERLAY_COLOR
            c4 = vec4<f32>(mix( c4.xyz, fogColor, fogFactor ) * length(c4.xyz) * (1.0 - fogFactor), c4.w);
        #else
            c4 = vec4<f32>(mix( c4.xyz, fogColor, fogFactor ), c4.w);
            #ifdef PREMULTIPLY_ALPHA
                c4 *= vec4<f32>(c4.www, 1.0);
            #endif
        #endif
        (*color) = c4;
    }
#endif
#ifdef USE_FOG
    #ifdef USE_FOG_COLOR_MAP
        fn getFogColorFromTexture2D(calcParam: CalcColor4Param) -> vec4<f32> {
            return textureSample(fogColorTexture, fogColorSampler, (params[7].xy + calcParam.worldPos.xz) / params[7].zw);
        }
    #endif
    fn useFog(color: ptr<function, vec4<f32>>, calcParam: CalcColor4Param) {

        var fogEnvColor = vec4<f32>(1.0);
        #ifdef USE_FOG_COLOR_MAP
            fogEnvColor = getFogColorFromTexture2D();
        #endif
        let fogDepth = -calcParam.viewPos.z;
        var fogColor = params[6].xyz;
        // for test
        // (*color) = params[6];
        // return;

        var c4 = *color;
        #ifdef USE_FOG_COLOR_MAP
            fogColor *= fogEnvColor;
        #endif
        #ifdef USE_FOG_EXP2
            let fogDensity = params[5].w;
            let fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
        #else
            let fogNear = params[5].x;
            let fogFar = params[5].y;
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
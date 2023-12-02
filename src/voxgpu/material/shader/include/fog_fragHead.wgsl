#ifdef VOX_USE_FOG
    #ifdef USE_FOG_COLOR_MAP
        // let fogEnvColor = vec3<f32>(1.0);
        fn getFogColorFromTexture2D() -> vec4<f32> {
            // vec4 color = VOX_Texture2D(tex, (params[6].xy + worldPosition.xz) / params[6].zw);
            return textureSample(fogColorTexture, fogColorSampler, (params[6].xy + worldPosition.xz) / params[6].zw);
            // fogEnvColor = color.xyz;
        }
    #endif
    fn useFog(color: ptr<function, vec4<f32>>, fogEnvColor: vec4<f32>) {
        var fogColor = params[5].xyz;
        let c4 = *color;
        #ifdef USE_FOG_COLOR_MAP
            fogColor *= fogEnvColor;
        #endif
        #ifdef USE_FOG_EXP2
            float fogDensity = params[5].w;
            float fogFactor = 1.0 - exp( - fogDensity * fogDensity * v_fogDepth * v_fogDepth );
        #else
            float fogNear = u_envLightParams[1].z;
            float fogFar = u_envLightParams[1].w;
            float fogFactor = smoothstep( fogNear, fogFar, v_fogDepth );
        #endif
        #ifdef USE_BRIGHTNESS_OVERLAY_COLOR
            (*color).xyz = mix( c4.xyz, fogColor, fogFactor ) * length(c4.xyz) * (1.0 - fogFactor);
        #else
            (*color).xyz = mix( c4.xyz, fogColor, fogFactor );
            #ifdef PREMULTIPLY_ALPHA
                (*color).xyz *= c4.w;
            #endif
        #endif
    }
#endif
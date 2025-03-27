// src/app/api/tag-config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateTagWriterParams, stringToHex, bufferToHex } from '@/lib/crypto/utils';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { url, accessRights, enableTagTamper } = data;

        // Validation
        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Get master key from environment variable
        const masterKey = process.env.MASTER_KEY || '00000000000000000000000000000000';

        // In production, we would validate that masterKey is not the default value
        if (process.env.NODE_ENV === 'production' && masterKey === '00000000000000000000000000000000') {
            console.warn('WARNING: Using default master key in production!');
        }

        // Generate parameters
        const params = generateTagWriterParams(
            masterKey,
            url,
            accessRights || '0F',
            enableTagTamper || false
        );

        // Add additional metadata useful for the NXP TagWriter app
        const enhancedParams = {
            ...params,
            tagType: enableTagTamper ? "NTAG_424_DNA_TT" : "NTAG_424_DNA",
            sdmEnabled: true,
            urlEncoded: stringToHex(url),
            timestamp: new Date().toISOString(),
            // Generate a unique file identifier
            fileId: bufferToHex(crypto.randomBytes(4)),
        };

        // Don't send the actual master key back to the client
        const { masterKey: _, ...safeParams } = enhancedParams;

        return NextResponse.json(safeParams);

    } catch (error) {
        console.error('Error generating tag configuration:', error);
        return NextResponse.json(
            { error: 'Failed to generate tag configuration' },
            { status: 500 }
        );
    }
}
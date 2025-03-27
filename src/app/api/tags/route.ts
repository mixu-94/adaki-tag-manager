// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isValidHex } from '@/lib/crypto/utils';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const {
            tagUid,
            tagType,
            redirectUrl,
            accessRights,
            derivationKey,
            ttStatusMirroring,
            notes
        } = data;

        // Validation
        if (!tagUid || !tagType) {
            return NextResponse.json(
                { error: 'Tag UID and type are required' },
                { status: 400 }
            );
        }

        // Validate tag UID format (should be a hex string)
        if (!isValidHex(tagUid)) {
            return NextResponse.json(
                { error: 'Tag UID must be a valid hexadecimal string' },
                { status: 400 }
            );
        }

        // Validate tag type
        if (!['DNA', 'DNA_TAGTAMPER'].includes(tagType)) {
            return NextResponse.json(
                { error: 'Tag type must be either "DNA" or "DNA_TAGTAMPER"' },
                { status: 400 }
            );
        }

        // Insert into database
        const { data: tag, error } = await supabaseAdmin
            .schema("nfc_verify")
            .from('programmed_tags')
            .insert({
                tag_uid: tagUid.toUpperCase(),
                tag_type: tagType,
                redirect_url: redirectUrl,
                access_rights: accessRights || '0F',
                derivation_key: derivationKey || '0F',
                tt_status_mirroring: ttStatusMirroring || false,
                notes
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting tag:', error);
            return NextResponse.json(
                { error: 'Failed to register tag' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Tag registered successfully',
            tag
        });

    } catch (error) {
        console.error('Error registering tag:', error);
        return NextResponse.json(
            { error: 'Failed to register tag' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { data: tags, error } = await supabaseAdmin
            .schema("nfc_verify")
            .from('programmed_tags')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tags:', error);
            return NextResponse.json(
                { error: 'Failed to fetch tags' },
                { status: 500 }
            );
        }

        return NextResponse.json(tags);

    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        );
    }
}
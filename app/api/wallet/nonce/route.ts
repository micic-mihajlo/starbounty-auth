import { NextRequest } from 'next/server';

const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

interface SorobanRequest {
    jsonrpc: string;
    id: number;
    method: string;
    params: {
        transaction: string;
    };
}

interface SorobanResponse {
    id: number;
    jsonrpc: string;
    result?: {
        status: string;
        hash: string;
        errorResultXdr?: string;
        resultXdr?: string;
    };
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

export async function POST(req: NextRequest) {
    try {
        const { transaction } = await req.json();

        if (!transaction) {
            return Response.json(
                { error: 'Missing required field: transaction' },
                { status: 400 }
            );
        }

        const requestBody: SorobanRequest = {
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'sendTransaction',
            params: {
                transaction
            }
        };

        const response = await fetch(SOROBAN_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const sorobanResponse: SorobanResponse = await response.json();

        if (sorobanResponse.error) {
            return Response.json(
                { 
                    error: 'Soroban transaction failed',
                    details: sorobanResponse.error
                },
                { status: 400 }
            );
        }

        return Response.json({
            success: true,
            result: sorobanResponse.result
        });

    } catch (error) {
        console.error('Error processing Soroban transaction:', error);
        return Response.json(
            { 
                error: 'Failed to process transaction',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }

}
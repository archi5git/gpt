const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const chatgpt2 = pc.index('chatgpt2-0');
async function createMemory({vector,metadata,messageId}){
    const results=await chatgpt2.upsert([{
        id: messageId,
        values: vector,
        metadata: metadata
    }]);
}
async function queryMemory({queryvector,limit=5,metadata}){
    const results=await chatgpt2.query({
        vector: queryvector,
        topK: limit,
        filter: metadata ? {metadata} : undefined,
        includeMetadata: true
    });
    return results.matches.slice(0,limit).map(match=>match.metadata);
}
module.exports={createMemory,queryMemory};

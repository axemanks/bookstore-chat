// /api/langchain
// langchain.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("endpoint hit")
    res.status(200).json({ name: 'Hello!' });
  }

    
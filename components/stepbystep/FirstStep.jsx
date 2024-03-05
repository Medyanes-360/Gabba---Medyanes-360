'use client'
import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { postAPI } from '@/services/fetchAPI';

const FirstStep = ({ id, lang }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await postAPI('/mail', { email: email, url: `http://localhost:3000/document?id=${id}&lang=tr` })
        } catch (error) {
            console.error('Error sending mail:', error);
        }
    };

    return (
        <form className='flex flex-col mx-auto my-auto' onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-4">
                <Label>
                    Email:
                </Label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <Button type="submit">Send Mail</Button>
        </form>
    );
};

export default FirstStep;

import { ReactNode } from 'react';

type FormLayoutProps = {
    title?: string;
    form: ReactNode;
};
export function FormLayout({ form, title }: FormLayoutProps) {
    return (
        <main className="flex flex-col">
            {title}
            <div className="card p-10 bg-base-200 shadow-xl self-center">
                {form}
            </div>
        </main>
    );
}

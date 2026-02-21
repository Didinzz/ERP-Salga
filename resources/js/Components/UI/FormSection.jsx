// Components/UI/FormSection.jsx
export default function FormSection({ title, children, className = "" }) {
    if (children) {
        return (
            <div className={className}>
                <div className="flex items-center gap-4 my-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                        {title}
                    </span>
                    <div className="h-px bg-gray-200 w-full"></div>
                </div>
                {children}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 my-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                {title}
            </span>
            <div className="h-px bg-gray-200 w-full"></div>
        </div>
    );
}
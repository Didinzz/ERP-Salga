import { FaCheckCircle } from "react-icons/fa";
import { FaUpload, FaImage } from "react-icons/fa6";

export default function UploadEvidence({ label, preview, onUpload }) {
    return (
        <div className="mt-2">
            <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>

            {/* Area Upload / Preview */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group overflow-hidden">
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={onUpload}
                />

                {preview ? (
                    // Tampilan Preview Image
                    <div className="relative h-32 w-full flex items-center justify-center bg-gray-100">
                        <img src={preview} alt="Bukti" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaCheckCircle className="text-green-400 text-2xl mb-1" />
                            <span className="text-white text-xs font-bold">Ganti Gambar</span>
                        </div>
                    </div>
                ) : (
                    // Tampilan Belum Upload
                    <div className="py-6 text-center text-gray-400 group-hover:text-blue-500">
                        <FaUpload className="mx-auto text-xl mb-2" />
                        <p className="text-xs font-medium">Klik untuk upload bukti</p>
                        <p className="text-[10px] mt-1 opacity-70">JPG/PNG Max 2MB</p>
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import type { InviteRequest } from '../../types/user';
import userManagementService from '../../services/userManagementService';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roleFilter?: 'FACULTY' | 'STUDENT';
}

export default function InviteUserModal({ isOpen, onClose, onSuccess, roleFilter }: InviteUserModalProps) {
    const [formData, setFormData] = useState<InviteRequest>({
        email: '',
        role: roleFilter || 'STUDENT',
    });
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const invite = await userManagementService.createInvite(formData);
            setInviteLink(invite.inviteLink);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send invite');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setFormData({ email: '', role: roleFilter || 'STUDENT' });
        setInviteLink(null);
        setError(null);
        setCopied(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Invite User</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {!inviteLink ? (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="user@example.com"
                                    />
                                </div>

                                {!roleFilter && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role *
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="FACULTY">Faculty</option>
                                            <option value="STUDENT">Student</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="btn-secondary"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 font-medium mb-2">Invite created successfully!</p>
                                <p className="text-sm text-green-700">
                                    Copy the link below and share it with the user. It expires in 7 days.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Invite Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={inviteLink}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button onClick={handleClose} className="btn-primary">
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

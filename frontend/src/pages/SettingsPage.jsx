import React, { useEffect } from 'react'
import { Send } from 'lucide-react'
import { useThemeStore } from '../store/useThemeStore'
import { useSettingsStore } from '../store/useSettingsStore'
import { THEMES } from '../constants/themes.constant'

const PREVIEW_MESSAGES = [
    { id: 0, content: "Hey! How's it going?", isSent: false },
    { id: 1, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
    const { theme, setTheme } = useThemeStore()
    const { settings, setSettings, getSettings, updateSettings, isSettingsLoading } = useSettingsStore()

    // Fetch settings on mount; let the store update the settings state directly.
    useEffect(() => {
        getSettings();
    }, [getSettings]);

    const handleSave = () => {
        updateSettings(settings);
    };

    return (
        <div className='height:100% container mx-auto px-4 pt-20 max-w-5xl'>
            <div role="tablist" className="tabs tabs-box">
                <input type="radio" name="setting" role="tab" className="tab" aria-label="Appearance" defaultChecked />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    <div className='height:100% container mx-auto px-4 pt-4 max-w-5xl'>
                        <div className='space-y-6'>
                            <h2 className="text-lg font-semibold">Theme</h2>
                            <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
                        </div>
                        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2'>
                            {THEMES.map((t) => (
                                <button
                                    key={t}
                                    className={`
                                        group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                                        ${theme === t ? "bg-base-300" : "hover:bg-base-200/50"}
                                    `}
                                    onClick={() => setTheme(t)}
                                >
                                    <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                            <div className="rounded bg-primary"></div>
                                            <div className="rounded bg-secondary"></div>
                                            <div className="rounded bg-accent"></div>
                                            <div className="rounded bg-neutral"></div>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium truncate w-full text-center">
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {/* Preview Section */}
                        <h3 className="text-lg font-semibold mb-3">Preview</h3>
                        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
                            <div className="p-4 bg-base-200">
                                <div className="max-w-lg mx-auto">
                                    <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                                                    J
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-sm">John Doe</h3>
                                                    <p className="text-xs text-base-content/70">Online</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                                            {PREVIEW_MESSAGES.map((message) => (
                                                <div key={message.id} className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
                                                    <div className="max-w-[80%] rounded-xl p-3 shadow-sm bg-base-200">
                                                        <p className="text-sm">{message.content}</p>
                                                        <p className="text-[10px] mt-1.5 text-base-content/70">
                                                            12:{"0" + message.id} PM
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 border-t border-base-300 bg-base-100">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="input input-bordered flex-1 text-sm h-10"
                                                    placeholder="Type a message..."
                                                    value="This is a preview"
                                                    readOnly
                                                />
                                                <button className="btn btn-primary h-10 min-h-0">
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <input type="radio" name="setting" role="tab" className="tab" aria-label="Messages" />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    <div className='height:100% container mx-auto px-4 pt-4 max-w-5xl flex flex-col'>
                        <h2 className="text-lg font-semibold mb-6">Messages</h2>
                        <div className='grid grid-cols-2 gap-3 bg-base-200 p-4 rounded-lg'>
                            <label className="flex items-center">Send read receipts</label>
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={settings.sendReadReceipts}
                                onChange={(e) =>
                                    setSettings({ ...settings, sendReadReceipts: e.target.checked })
                                }
                            />
                            <label className="flex items-center">Send typing indicators</label>
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={settings.sendTypingIndicators}
                                onChange={(e) =>
                                    setSettings({ ...settings, sendTypingIndicators: e.target.checked })
                                }
                            />
                            <label className="flex items-center">Show online status</label>
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={settings.showOnline}
                                onChange={(e) =>
                                    setSettings({ ...settings, showOnline: e.target.checked })
                                }
                            />
                        </div>
                        <button
                            className="btn btn-primary mt-6 self-end"
                            onClick={handleSave}
                            disabled={isSettingsLoading}
                        >
                            {isSettingsLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
                <input type="radio" name="setting" role="tab" className="tab" aria-label="Flashcards" />
                <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                <input type="radio" name="setting" role="tab" className="tab" aria-label="Reader" />
                <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 4</div>
                <input type="radio" name="setting" role="tab" className="tab" aria-label="News" />
                <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 5</div>
            </div>
        </div>
    )
}

export default SettingsPage
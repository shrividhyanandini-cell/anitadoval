import React, { useState } from 'react'
import { Download, Upload, AlertCircle, CheckCircle2, RefreshCw, FileText, Check, ShieldCheck } from 'lucide-react'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Button from '../UI/Button'
import Loading from '../UI/Loading'
import { runContentImport } from '../../utils/contentImporter'

const COLLECTIONS = [
    'settings', 'page_headers', 'services', 'faqs', 'about', 'blogs', 'guides', 'testimonials', 'media', 'hero_config'
]

const BackupManager = () => {
    const [loading, setLoading] = useState(false)
    const [importLoading, setImportLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [seedResults, setSeedResults] = useState(null)
    const [importLogs, setImportLogs] = useState([])

    const handleRunSeedImport = async () => {
        if (!window.confirm("Run content import from Anita_Doval_Firebase_Content_Seed.json?\n\nThis will safely upsert services, FAQs, blogs, and testimonials as DRAFT records using stable document IDs without creating duplicates.")) {
            return
        }

        setImportLoading(true)
        setMessage({ type: '', text: '' })
        setSeedResults(null)

        try {
            const res = await runContentImport()
            setSeedResults(res.stats)
            setImportLogs(res.logs)
            setMessage({
                type: 'success',
                text: `Content seed completed! Services: ${res.stats.services.total}, FAQs: ${res.stats.faqs.total}, Blogs: ${res.stats.blogs.total}. All imported records set to "draft" for editorial review.`
            })
        } catch (error) {
            console.error('Seed import error', error)
            setMessage({ type: 'error', text: `Failed to import seed content: ${error.message}` })
        } finally {
            setImportLoading(false)
        }
    }

    const handleExport = async () => {
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            const backupData = {}
            for (const col of COLLECTIONS) {
                const querySnapshot = await getDocs(collection(db, col))
                backupData[col] = {}
                querySnapshot.forEach((docSnap) => {
                    backupData[col][docSnap.id] = docSnap.data()
                })
            }

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2))
            const downloadAnchorNode = document.createElement('a')
            downloadAnchorNode.setAttribute("href", dataStr)
            downloadAnchorNode.setAttribute("download", `anita_doval_backup_${new Date().toISOString().split('T')[0]}.json`)
            document.body.appendChild(downloadAnchorNode)
            downloadAnchorNode.click()
            downloadAnchorNode.remove()

            setMessage({ type: 'success', text: 'Database exported successfully!' })
        } catch (error) {
            console.error('Export error', error)
            setMessage({ type: 'error', text: 'Failed to export database.' })
        } finally {
            setLoading(false)
        }
    }

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!window.confirm("WARNING: Importing will Overwrite and Merge into existing collections. Make sure you know what you are doing! Continue?")) return

        setLoading(true)
        setMessage({ type: '', text: '' })

        const reader = new FileReader()
        reader.onload = async (event) => {
            try {
                const backupData = JSON.parse(event.target.result)

                // Support both full backup format and Anita_Doval_Firebase_Content_Seed format
                if (backupData.services && Array.isArray(backupData.services)) {
                    // Seed format file uploaded
                    const res = await runContentImport(backupData)
                    setSeedResults(res.stats)
                    setImportLogs(res.logs)
                    setMessage({
                        type: 'success',
                        text: `Custom seed file processed! Services: ${res.stats.services.total}, FAQs: ${res.stats.faqs.total}, Blogs: ${res.stats.blogs.total}.`
                    })
                } else {
                    // Standard backup dictionary format
                    for (const col of Object.keys(backupData)) {
                        if (COLLECTIONS.includes(col)) {
                            const documents = backupData[col]
                            for (const [docId, docData] of Object.entries(documents)) {
                                await setDoc(doc(db, col, docId), docData, { merge: true })
                            }
                        }
                    }
                    setMessage({ type: 'success', text: 'Database backup imported successfully!' })
                }
            } catch (error) {
                console.error('Import error', error)
                setMessage({ type: 'error', text: 'Invalid backup file or upload failed.' })
            } finally {
                setLoading(false)
            }
        }
        reader.readAsText(file)
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">System Backup & Content Seed</h2>
                <p className="text-gray-600">Manage database backups and run official idempotent content imports into Firestore.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                    {message.type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}

            {/* Official Seed Importer Card */}
            <div className="border border-blue-100 bg-blue-50/40 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-1 uppercase tracking-wider">
                            <ShieldCheck size={18} /> Official Content Seed Workflow
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Import Anita Doval Seed Content</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            Safely seeds <strong>Services (7)</strong>, <strong>FAQs (8)</strong>, <strong>Blogs (9)</strong>, and <strong>Testimonials (0)</strong> from <code className="bg-white px-1.5 py-0.5 rounded text-blue-800 font-mono text-xs border border-blue-200">Anita_Doval_Firebase_Content_Seed.json</code> into Firestore.
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                            <li className="flex items-center gap-1.5"><Check size={14} className="text-green-600" /> Uses stable document IDs (non-destructive upsert, safe to rerun)</li>
                            <li className="flex items-center gap-1.5"><Check size={14} className="text-green-600" /> All records set to <strong>draft</strong> status for editorial approval</li>
                            <li className="flex items-center gap-1.5"><Check size={14} className="text-green-600" /> Only published records will appear on public storefront</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                        <Button
                            onClick={handleRunSeedImport}
                            loading={importLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 px-6 shadow-md hover:shadow-lg transition-all"
                        >
                            <RefreshCw size={18} className={importLoading ? 'animate-spin' : ''} />
                            {importLoading ? 'Syncing with Firestore...' : 'Run Seed Content Import'}
                        </Button>
                    </div>
                </div>

                {/* Import stats display */}
                {seedResults && (
                    <div className="mt-6 pt-6 border-t border-blue-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white p-3.5 rounded-xl border border-blue-100 text-center">
                            <span className="text-xs text-gray-400 uppercase font-semibold block">Services</span>
                            <span className="text-xl font-black text-blue-600">{seedResults.services.total}</span>
                            <span className="text-[11px] text-gray-500 block">({seedResults.services.created} new, {seedResults.services.updated} updated)</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-blue-100 text-center">
                            <span className="text-xs text-gray-400 uppercase font-semibold block">FAQs</span>
                            <span className="text-xl font-black text-blue-600">{seedResults.faqs.total}</span>
                            <span className="text-[11px] text-gray-500 block">({seedResults.faqs.created} new, {seedResults.faqs.updated} updated)</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-blue-100 text-center">
                            <span className="text-xs text-gray-400 uppercase font-semibold block">Blogs</span>
                            <span className="text-xl font-black text-blue-600">{seedResults.blogs.total}</span>
                            <span className="text-[11px] text-gray-500 block">({seedResults.blogs.created} new, {seedResults.blogs.updated} updated)</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-blue-100 text-center">
                            <span className="text-xs text-gray-400 uppercase font-semibold block">Testimonials</span>
                            <span className="text-xl font-black text-blue-600">{seedResults.testimonials.total}</span>
                            <span className="text-[11px] text-gray-500 block">(Verified authentic only)</span>
                        </div>
                    </div>
                )}

                {/* Audit Logs Accordion / Box */}
                {importLogs.length > 0 && (
                    <div className="mt-4 bg-gray-900 text-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
                        <div className="text-gray-400 font-semibold mb-1 pb-1 border-b border-gray-800 flex items-center gap-2">
                            <FileText size={14} /> Import Audit Log ({importLogs.length} entries)
                        </div>
                        {importLogs.map((log, i) => (
                            <div key={i} className="leading-relaxed">{log}</div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Export Card */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Download size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">Export Database Snapshot</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Download a complete JSON snapshot of all collections including services, FAQs, blogs, testimonials, and settings.</p>

                    <Button onClick={handleExport} loading={loading} className="w-full flex items-center justify-center gap-2">
                        <Download size={18} /> Download JSON Backup
                    </Button>
                </div>

                {/* Import Card */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                        <Upload size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">Restore from Backup File</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Restore or merge configuration from a JSON file (supports backup exports or custom seed JSON).</p>

                    <input type="file" accept=".json" id="import-json" className="hidden" onChange={handleImport} disabled={loading} />
                    <label htmlFor="import-json" className="w-full">
                        <Button as="span" variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer border-orange-200 text-orange-600 hover:bg-orange-50">
                            {loading ? <Loading type="spinner" size="sm" /> : <Upload size={18} />} Restore from JSON
                        </Button>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default BackupManager

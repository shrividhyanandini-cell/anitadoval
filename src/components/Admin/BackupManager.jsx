import React, { useState } from 'react'
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const COLLECTIONS = [
    'settings', 'page_headers', 'services', 'about', 'blogs', 'guides', 'testimonials', 'media', 'hero_config'
]

const BackupManager = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

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

                for (const col of Object.keys(backupData)) {
                    if (COLLECTIONS.includes(col)) {
                        const documents = backupData[col]
                        for (const [docId, docData] of Object.entries(documents)) {
                            // Merge updates to avoid blowing away unrelated fields if any
                            await setDoc(doc(db, col, docId), docData, { merge: true })
                        }
                    }
                }
                setMessage({ type: 'success', text: 'Database imported successfully!' })
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
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">System Backup & Migration</h2>
            <p className="text-gray-600 mb-8">Export all Firestore configurations, text, and media references to a JSON file. Use this if you are migrating servers.</p>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Export Card */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Download size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">Export Database</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Download a complete snapshot of all dynamic sections, settings, and media lists.</p>

                    <Button onClick={handleExport} loading={loading} className="w-full flex items-center justify-center gap-2">
                        <Download size={18} /> Download JSON Backup
                    </Button>
                </div>

                {/* Import Card */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                        <Upload size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">Import Database</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Restore your configuration from a previously exported JSON backup file.</p>

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

import { Outlet } from 'react-router-dom'
import useStore from '../store/useStore'

export default function AppPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
			<Outlet />
		</div>
	)
}

export function AppHome() {
	const business = useStore((s) => s.business)

	return (
		<div className="container py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-white mb-2">
					Welcome, {business?.business_name || 'User'}!
				</h1>
				<p className="text-slate-400 mb-8">
					Today's content generation and management
				</p>

				{/* Quick Actions */}
				<div className="grid md:grid-cols-2 gap-6 mb-8">
					<div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
						<h2 className="text-xl font-semibold text-white mb-4">Daily Update</h2>
						<p className="text-slate-300 mb-4">Generate today's content ideas, captions, and hashtags</p>
						<button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg">
							Update for Today
						</button>
					</div>

					<div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
						<h2 className="text-xl font-semibold text-white mb-4">Generate Images</h2>
						<p className="text-slate-300 mb-4">Create social media posters and logos</p>
						<button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg">
							Generate Images
						</button>
					</div>
				</div>

				{/* Today's Insights */}
				<div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
					<h2 className="text-xl font-semibold text-white mb-4">Today's Insights</h2>
					<div className="text-slate-400">
						<p>No updates yet. Click "Update for Today" to generate content.</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export function AppSettings() {
	const business = useStore((s) => s.business)

	return (
		<div className="container py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

				{/* Business Info */}
				<div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 mb-6">
					<h2 className="text-xl font-semibold text-white mb-4">Business Information</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-slate-300 text-sm font-medium mb-2">Business Name</label>
							<input
								type="text"
								defaultValue={business?.business_name || ''}
								className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
								placeholder="Your business name"
							/>
						</div>

						<div>
							<label className="block text-slate-300 text-sm font-medium mb-2">Business Type</label>
							<select className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none">
								<option>Select type</option>
								<option selected={business?.business_type === 'Retail'}>Retail</option>
								<option selected={business?.business_type === 'Food'}>Food</option>
								<option selected={business?.business_type === 'Services'}>Services</option>
								<option selected={business?.business_type === 'Technology'}>Technology</option>
							</select>
						</div>

						<div>
							<label className="block text-slate-300 text-sm font-medium mb-2">Location</label>
							<input
								type="text"
								defaultValue={business?.location || ''}
								className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
								placeholder="City / Region"
							/>
						</div>

						<button className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium">
							Save Changes
						</button>
					</div>
				</div>

				{/* Account */}
				<div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
					<h2 className="text-xl font-semibold text-white mb-4">Account</h2>
					<button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
						Logout
					</button>
				</div>
			</div>
		</div>
	)
}

<script>
	import { Smartphone } from 'lucide-svelte';
</script>

<div class="blocker">
	<div class="content">
		<Smartphone size={64} strokeWidth={1.5} />
		<h1>Your screen is too small :/</h1>
		<p>Monomarket only works on devices with larger screens, sorry!</p>
    <p>I would implement mobile support, but it doesn't make sense for the project as you need to view detailed graphs.</p>
    <p>If you're a Hackclub voter, PLEASE come back on a device with more width before voting.</p>
		<p><b>If you're on a tablet, try rotating the device.</b></p>
	</div>
</div>

<style>
	.blocker {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: white;
		z-index: 10000;
		justify-content: center;
		align-items: center;
	}

	@media (max-width: 1270px) {
		.blocker {
			display: flex;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem;
		gap: 1rem;
		color: #333;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}

	p {
		font-size: 1rem;
		margin: 0;
		max-width: 300px;
		line-height: 1.5;
	}

	.hint {
		color: #666;
		font-size: 0.9rem;
	}
</style>

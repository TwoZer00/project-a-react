const STORAGE_KEY = 'recentPlays';
const MAX_ITEMS = 15;

export function savePlay(post) {
    if (!post?.id) return;
    const plays = getRecentPlays();
    const entry = {
        id: post.id,
        tags: (post.tags || []).map(t => t.path || t.id),
        category: post.category?.id || post.category?.path || null,
        timestamp: Date.now()
    };
    const filtered = plays.filter(p => p.id !== post.id);
    filtered.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
}

export function getRecentPlays() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
}

export function getTopTags(maxTags = 10) {
    const plays = getRecentPlays();
    const freq = {};
    plays.forEach(p => p.tags?.forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxTags)
        .map(([tag]) => tag);
}

export function getTopCategories(max = 3) {
    const plays = getRecentPlays();
    const freq = {};
    plays.forEach(p => { if (p.category) freq[p.category] = (freq[p.category] || 0) + 1; });
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, max)
        .map(([cat]) => cat);
}

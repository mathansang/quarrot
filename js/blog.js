const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        const posts = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const selectedPost = ref(null);
        const selectedPostLoading = ref(false);
        const selectedPostError = ref(null);
        const currentPage = ref('blog');
        const currentYear = ref(new Date().getFullYear());

        const renderedContent = computed(() => {
            if (!selectedPost.value) return '';
            return marked.parse(selectedPost.value);
        });

        async function fetchBlogList() {
            try {
                const response = await fetch('blog/list.json');
                const data = await response.json();
                posts.value = data.list;
            } catch (err) {
                error.value = '게시물 목록을 불러오는데 실패했습니다.';
                console.error('블로그 목록 로딩 실패:', err);
            } finally {
                loading.value = false;
            }
        }

        async function fetchBlogPost(filename) {
            selectedPostLoading.value = true;
            selectedPostError.value = null;
            try {
                const response = await fetch(`blog/${filename}`);
                const content = await response.text();
                selectedPost.value = content;
            } catch (err) {
                selectedPostError.value = '게시물을 불러오는데 실패했습니다.';
                console.error('게시물 로딩 실패:', err);
            } finally {
                selectedPostLoading.value = false;
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        async function selectPost(post) {
            await fetchBlogPost(post.file);
        }

        // 초기 데이터 로드
        fetchBlogList();

        return {
            posts,
            loading,
            error,
            selectedPost,
            selectedPostLoading,
            selectedPostError,
            renderedContent,
            formatDate,
            selectPost,
            currentPage,
            currentYear
        };
    }
}).mount('#app'); 
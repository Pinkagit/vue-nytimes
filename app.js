// app.js
/* const vm = new Vue({
    el: "#app",
    data: {
        results: []
    },
    mounted:function() {
        axios.get('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=a75cc020baf0473a978f6ef603921d01').then(response => {
            console.log(this)
            this.results = response.data.results;
        })
    }
}) */

/* http://api.nytimes.com/svc/topstories/v2/{section}.{response-format}?api-key={your-api-key} */
/* 
    section: the section name
    response-format: json or jsonp
 */
const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const Apikey = "a75cc020baf0473a978f6ef603921d01";

function buildUrl(url) {
    return NYTBaseUrl + url + ".json?api-key=" + Apikey;
}

Vue.component('news-list', {
    props: ['results'],
    template: `
        <section>
            <div class="row" v-for="posts in processedPosts">
                <div class="columns large-3 medium-6" v-for="post in posts">
                    <div class="card">
                        <div class="card-divider">
                            {{ post.title }}
                        </div>
                        <a :href="post.url" target="_blank">
                            <img :src="post.image_url">
                        </a>
                        <div class="card-section">
                            <p>{{ post.abstract }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    computed: {
        processedPosts() {
            console.log("1---------")
            let posts = this.results;
            
            //添加image_url属性
            posts.map(post => {
                let imgObj = post.multimedia.find(media => {
                    return media.format == "superJumbo"
                });
                post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A"
            })

            //将数据分组
            let i, j, chunkedArray = [], chunk = 4;
            for (i = 0, j = 0; i < posts.length; i += chunk, j++) {
                chunkedArray[j] = posts.slice(i, i + chunk)
            }
            return chunkedArray;

        }
    }
})

const SECTION = "home, arts, automobiles, books, business, fashion, food, health, insider, magazine, movies, national, nyregion, obituaries, opinion, politics, realestate, science, sports, sundayreview, technology, theater, tmagazine, travel, upshot, world";

const vm = new Vue({
    el: "#app",
    data: {
        results: [],
        sections: SECTION.split(', '),
        section: 'home'
    },
    mounted: function () {
        this.getPosts(this.section);
        console.log("sections:", this.sections);
    },
    methods: {
        getPosts: function (section) {
            let url = buildUrl(section);
            console.log("url:", url);

            axios.get(url).then(response => {
                console.log("response:", response);
                this.results = response.data.results;
                console.log("results:", this.results);
            }).catch(error => {
                console.log(error);
            })
        }
    }
})
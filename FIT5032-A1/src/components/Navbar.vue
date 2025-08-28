<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-3 border-bottom">
        <a class="navbar-brand">SportsConnect</a>

        <div class="d-flex align-items-center flex-grow-1 mx-2">
            <SearchBar/>
        </div>

        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#' + id"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" :id="id">
            <ul class="navbar-nav me-3">
                <li>
                    <Dropdown label="Explore" 
                    items="[
                        {text: 'Map', action: '() => {}'},
                        {text: 'Search', action: '() => {}'},
                        {text: 'Teams', action: '() => {}'},
                        {text: 'Events', action: '() => {}'}
                    ]"
                    @select="() => {}"/>
                </li>
                <li>
                    <Dropdown label="Teams and Events" 
                    items="[
                        {text: 'Teams', action: '() => {}'},
                        {text: 'Events', action: '() => {}'}
                    ]"
                    @select="() => {}"/>
                </li>
                <li>
                    <Dropdown label="Articles" 
                    @select="() => {}"/>
                </li>
                <li>
                    <Dropdown label="About Us" 
                    items="[
                        {text: 'Meet the team', action: '() => {}'},
                        {text: 'Contact us', action: '() => {}'}
                    ]"
                    @select="() => {}"/>
                </li>
            </ul>
        </div>

        <IconButton icon="person-circle"/>
    </nav>
</template>

<script setup>
    import Dropdown from './Dropdown.vue';
    import SearchBar from './SearchBar.vue';
    import IconButton from './IconButton.vue';
</script>
<template>
    <section>
        <b-field v-bind:label="label">
            <b-autocomplete
                size="is-medium"
                field="title"
                :data="data"
                :placeholder="placeholder"
                :loading="isFetching"
                @typing="getAsyncData"
                @select="option => selected = option"
            >
                <template slot-scope="props">
                    <div class="media">
                        <div class="media-left">
                            <img
                                width="32"
                                :src="`https://image.tmdb.org/t/p/w500/${props.option.poster_path}`"
                            />
                        </div>
                        <div class="media-content">
                            {{ props.option.title }}
                            <br />
                            <small>
                                Released at {{ props.option.release_date }},
                                rated
                                <b>{{ props.option.vote_average }}</b>
                            </small>
                        </div>
                    </div>
                </template>
            </b-autocomplete>
        </b-field>
    </section>
</template>

<script lang="ts">
import axios from "axios";
import debounce from "lodash/debounce";

import Vue from "vue";
import Component from "vue-class-component";

const BaseField = Vue.extend({
    props: {
        data: Array,
        label: String,

        placeholder: String,

        selected: Object,
        isFetching: Boolean
    }
});

@Component
export default class Field extends BaseField {
    selected = null;
    isFetching = false;

    get getAsyncData() {
        return debounce(name => {
            if (!name.length) {
                this.data = [];
                return;
            }
            this.isFetching = true;

            axios
                .get(
                    `https://api.themoviedb.org/3/search/movie?api_key=bb6f51bef07465653c3e553d6ab161a8&query=${name}`
                )
                .then(({ data }) => {
                    this.data = [];
                    data.results.forEach((item: any) => this.data.push(item));
                })
                .catch(error => {
                    this.data = [];
                    throw error;
                })
                // @ts-ignore
                .finally(() => {
                    this.isFetching = false;
                });
        }, 500);
    }
}
</script>
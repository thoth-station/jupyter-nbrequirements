<template>
    <section v-bind:style="css">
        <b-table
            :data="isEmpty ? [] : data"
            :loading="loading"
            paginated
            backend-pagination
            :total="total"
            :per-page="perPage"
            @page-change="onPageChange"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            backend-sorting
            :default-sort-direction="defaultSortOrder"
            :default-sort="[sortField, sortOrder]"
            @sort="onSort"
        >
            <template slot-scope="props">
                <b-table-column
                    field="package_name"
                    label="Package"
                    sortable
                >{{ props.row.package_name }}</b-table-column>

                <b-table-column field="constraint" label="Constraint">{{ props.row.constraint }}</b-table-column>

                <b-table-column field="release" label="Release">{{ props.row.release }}</b-table-column>

                <b-table-column field="score" label="Score" numeric sortable>
                    <span class="tag" :class="type(props.row.score)">{{ props.row.score }}</span>
                </b-table-column>

                <b-table-column field="actions" label="Action">
                    <div class="level">
                        <b-button
                            class="level-item"
                            icon-right="pencil"
                            size="is-medium"
                            @click="console.log('Edit' + row)"
                        />
                        <b-button
                            class="level-item"
                            icon-right="delete-outline"
                            size="is-medium"
                            @click="console.log('Delete' + row)"
                        />
                        <b-button
                            class="level-item"
                            icon-right="pin-outline"
                            size="is-medium"
                            @click="console.log('Pin' + row)"
                        />
                    </div>
                </b-table-column>
                <!-- <b-table-column label="Summary" width="500">{{ props.row.summary | truncate(80) }}</b-table-column> -->
            </template>

            <template slot="footer">
                <span />
            </template>

            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon icon="emoticon-sad" size="is-large"></b-icon>
                        </p>
                        <p>This notebook has no requirements specified.</p>
                    </div>
                </section>
            </template>
        </b-table>

        <PackageFinder ref="packageFinder" />
    </section>
</template>

<script lang="ts">
import _ from "lodash";
import axios from "axios";

import { Logger } from "../config";
import { Requirements } from "../types/requirements";

import Vue from "vue";

import Component from "vue-class-component";
import PackageFinder from "./components/package-finder.vue";

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseUI = Vue.extend({
    props: {
        isEmpty: Boolean,

        css: Object,

        data: Array,
        total: Number,

        loading: Boolean,

        sortField: String,
        sortOrder: String,
        defaultSortOrder: String,

        page: Number,
        perPage: Number
    }
});

@Component({
    filters: {
        /**
         * Filter to truncate string, accepts a length parameter
         */
        truncate(value: string, length: number) {
            if (_.isUndefined(value)) {
                return "";
            }
            return value.length > length
                ? value.substr(0, length) + "..."
                : value;
        }
    },
    components: {
        PackageFinder
    }
})
export default class UI extends BaseUI {
    // Component properties and methods set in the decorator
    $refs!: {
        packageFinder: PackageFinder;
    };

    css = {
        "padding-bottom": "30px"
    };

    isEmpty: boolean = true;
    loading = true;

    page: number = 1;
    perPage: number = 10;

    sortField: string = "score";
    sortOrder: string = "desc";
    defaultSortOrder: string = "desc";

    total: number = 0;

    /*
     * Load async data
     */
    async loadAsyncData() {
        this.loading = true;

        this.data = [];
        this.total = 0;

        const requirements: Requirements =
            Jupyter.notebook.metadata.requirements || {};

        const data: any[] = [];
        for (let [pkg, version] of Object.entries(requirements.packages)) {
            // get info about the package from PyPI
            let item: {
                package_name: string;
                constraint: string;
                release: string;
                summary: string;
                score: string;
            };

            await axios
                .get(`https://pypi.org/pypi/${pkg}/json`)
                .then(response => {
                    const package_data = response.data;

                    if (typeof version !== "string") {
                        version = version.version;
                    }
                    item = {
                        package_name: pkg,
                        constraint: version as string,
                        release: package_data.info.version,
                        summary: package_data.info.summary,
                        score: (Math.random() * 10).toPrecision(2) // TODO
                    };
                    data.push(item);
                })
                .catch((err: Error) => {
                    this.data = [];
                    this.isEmpty = true;

                    throw err;
                });
        }

        setTimeout(() => {
            // Timeout to avoid blink-loading
            this.data = data;

            this.total = this.data.length;
            this.isEmpty = this.total <= 0;

            this.loading = false;
        }, 1000);
    }
    onAddDependency() {}
    /*
     * Handle page-change event
     */
    onPageChange(page: number) {
        this.page = page;
        // TODO: Paging
    }
    /*
     * Handle sort event
     */
    onSort(field: string, order: string) {
        this.sortField = field;
        this.sortOrder = order;

        this.data = Array.from(this.data).sort((a: any, b: any) => {
            let ret: number;

            if (a[field] < b[field]) ret = -1;
            else if (a[field] > b[field]) ret = 1;
            else ret = 0;

            return ret * (order === "desc" ? -1 : 1);
        });
    }
    /*
     * Type style in relation to the value
     */
    type(value: string) {
        const number = parseFloat(value);

        if (number < 6) {
            return "is-danger";
        } else if (number >= 6 && number < 8) {
            return "is-warning";
        } else if (number >= 8) {
            return "is-success";
        }
    }

    mounted() {
        this.loadAsyncData();
    }
}
</script>

<style scoped>
@import url(https://use.fontawesome.com/releases/v5.2.0/css/all.css);
@import url(https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css);
</style>
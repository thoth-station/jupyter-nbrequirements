<template>
    <section v-bind:style="style">
        <b-table
            :data="data"
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

                <b-table-column field="score" label="Score" numeric sortable>
                    <span class="tag" :class="type(props.row.score)">{{ props.row.score }}</span>
                </b-table-column>

                <b-table-column field="constraint" label="Constraint">{{ props.row.constraint }}</b-table-column>

                <b-table-column field="release" label="Release">{{ props.row.release }}</b-table-column>

                <b-table-column label="Summary" width="500">{{ props.row.summary | truncate(80) }}</b-table-column>
            </template>
        </b-table>
        <div class="columns is-centered">
            <b-button
                rounded
                icon-right="plus-circle-outline"
                size="is-medium"
                @click="onAddDependency"
            />
        </div>
    </section>
</template>

<script lang="ts">
import axios from "axios";

import Vue from "vue";
import Component from "vue-class-component";

import { Logger } from "../../config";
import { Requirements } from "../../types/requirements";

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseUI = Vue.extend({
    props: {
        style: Object,
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
            return value.length > length
                ? value.substr(0, length) + "..."
                : value;
        }
    }
})
export default class UI extends BaseUI {
    style = {
        "padding-bottom": "30px"
    };

    page: number = 1;
    perPage: number = 10;

    sortField: string = "score";
    sortOrder: string = "desc";
    defaultSortOrder: string = "desc";

    total: number = 0;

    /*
     * Load async data
     */
    loadAsyncData() {
        this.loading = true;

        this.data = [];
        this.total = 0;

        const requirements: Requirements =
            Jupyter.notebook.metadata.requirements || {};
        for (let [pkg, version] of Object.entries(requirements.packages)) {
            // get info about the package from PyPI
            let item: {
                package_name: string;
                constraint: string;
                release: string;
                summary: string;
                score: string;
            };

            axios
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
                    this.data.push(item);
                    this.total += 1;
                })
                .catch((err: Error) => {
                    this.loading = false;
                    Logger.error(err);
                });
        }

        this.loading = false;
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
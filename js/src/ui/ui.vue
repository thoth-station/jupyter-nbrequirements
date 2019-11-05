<template>
    <section v-bind:style="css">
        <b-table
            :data="isEmpty ? [] : data"
            :loading="loading"
            paginated
            backend-pagination
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

                <b-table-column
                    centered
                    field="constraint"
                    label="Constraint"
                >{{ props.row.constraint }}</b-table-column>

                <b-table-column centered field="release" label="Release">{{ props.row.release }}</b-table-column>

                <b-table-column field="score" label="Score" numeric sortable>
                    <span
                        class="tag"
                        style="width: 3.5em; font-size: .65em;"
                        :class="type(props.row.score)"
                    >{{ props.row.score }}</span>
                </b-table-column>

                <b-table-column field="actions" label="Action">
                    <div class="level" style="padding-bottom: unset;">
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
                        <template v-if="loading">
                            <p>
                                <b-icon icon="timer-sand" size="is-large"></b-icon>
                            </p>
                            <p>Loading notebook requirements...</p>
                        </template>
                        <template v-else>
                            <p>
                                <b-icon icon="emoticon-sad" size="is-large"></b-icon>
                            </p>
                            <p>This notebook has no requirements specified.</p>
                        </template>
                    </div>
                </section>
            </template>
        </b-table>

        <PackageFinder ref="packageFinder" />
    </section>
</template>

<script lang="ts">
import _ from "lodash";

import { Logger } from "../config";
import { Requirements } from "../types/requirements";

import Vue from "vue";
import { mapState } from "vuex";

import Component from "vue-class-component";
import PackageFinder from "./components/package-finder.vue";

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseUI = Vue.extend({
    props: {
        css: Object,

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
    },
    computed: mapState(["data", "loading"])
})
export default class UI extends BaseUI {
    // Component properties and methods set in the decorator
    $refs!: {
        packageFinder: PackageFinder;
    };

    data!: any[]; // TODO: PyPI interface
    loading!: boolean;

    css = {
        "padding-bottom": "30px"
    };

    page: number = 1;
    perPage: number = 10;

    sortField: string = "score";
    sortOrder: string = "desc";
    defaultSortOrder: string = "desc";

    total: number = 0;

    get isEmpty(): boolean {
        return this.$store.state.data.length <= 0;
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

        this.$store.commit("sortData", { field: field, order: order });
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
        this.$store.dispatch("loadData");
    }
}
</script>

<style scoped>
@import url(https://use.fontawesome.com/releases/v5.2.0/css/all.css);
@import url(https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css);
</style>
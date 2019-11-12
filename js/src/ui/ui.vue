<template>
    <section>
        <b-collapse aria-id="nbrequirements-ui" class="panel" :open.sync="isExpanded">
            <div
                aria-controls="nbrequirements-ui"
                class="nbrequirements-ui-trigger columns is-centered"
                role="button"
                slot="trigger"
            >
                <b-notification
                    class="trapezoid"
                    style="background-color: transparent; padding: unset;"
                    :closable="false"
                >
                    <b-icon
                        custom-class="mdi-18px"
                        icon="pin-outline"
                        size="is-small"
                        style="position: absolute; top: -20px; right: 18px;"
                        :type="pinColour"
                    ></b-icon>
                    <b-loading :active.sync="displayLoader" :can-cancel="true" :is-full-page="true">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <b-icon
                                pack="fas"
                                icon="sync-alt"
                                size="is-large"
                                custom-class="fa-spin"
                            ></b-icon>
                            <br />
                            <span
                                class="has-text-weight-large is-family-primary"
                                style="font-size: 2rem;"
                            >Loading notebook requirements...</span>
                        </div>
                    </b-loading>
                </b-notification>
            </div>

            <b-table
                aria-next-label="Next page"
                aria-previous-label="Previous page"
                aria-page-label="Page"
                aria-current-label="Current page"
                backend-pagination
                backend-sorting
                paginated
                style="margin-top: 30px"
                :data="isEmpty ? [] : data"
                :default-sort-direction="defaultSortOrder"
                :default-sort="[sortField, sortOrder]"
                :loading="loading"
                :per-page="perPage"
                @page-change="onPageChange"
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

                    <b-table-column field="health" label="Health" numeric sortable>
                        <span
                            class="tag"
                            style="width: 3.5em; font-size: .65em;"
                            :class="type(props.row.health)"
                        >{{ props.row.health }}</span>
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

            <Installer ref="installer" />
        </b-collapse>
    </section>
</template>

<script lang="ts">
import _ from "lodash";

import { Logger } from "../config";
import { Requirements } from "../types/requirements";

import Vue from "vue";
import { mapState } from "vuex";

import Component from "vue-class-component";
import Installer from "./components/install.vue";
import PackageFinder from "./components/package-finder.vue";

// Jupyter runtime environment
// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseUI = Vue.extend({
    props: {
        sortField: String,
        sortOrder: String,
        defaultSortOrder: String,

        isCollapsed: Boolean,

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
        Installer,
        PackageFinder
    },
    computed: mapState(["data", "loading"])
})
export default class UI extends BaseUI {
    // Component properties and methods set in the decorator
    $refs!: {
        installer: Installer;
        packageFinder: PackageFinder;
    };

    data!: any[]; // TODO: PyPI interface
    loading!: boolean;

    isExpanded = false;

    page: number = 1;
    perPage: number = 10;

    sortField: string = "health";
    sortOrder: string = "desc";
    defaultSortOrder: string = "desc";

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

    get displayLoader(): boolean {
        return this.loading && !this.isExpanded;
    }

    get pinColour(): string {
        if (this.loading) return "is-dark";
        if (this.isEmpty) return "is-warning";

        if (this.$store.state.warnings.length > 0) {
            for (const warning of this.$store.state.warnings) {
                if (warning.level === "danger") return "is-danger";
            }

            return "is-warning";
        }

        return "is-success";
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
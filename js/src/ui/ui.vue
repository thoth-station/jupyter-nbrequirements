<template>
    <section ref="app" id="nbrequirements-ui">
        <b-collapse aria-id="nbrequirements-ui" class="panel" :open.sync="isExpanded">
            <div
                aria-controls="nbrequirements-ui"
                id="nbrequirements-ui-trigger "
                class="columns is-centered"
                role="button"
                slot="trigger"
            >
                <b-notification
                    class="trapezoid"
                    style="background-color: transparent; padding: unset;"
                    :closable="false"
                >
                    <b-icon
                        v-if="status.current === 'installation'"
                        custom-class="fa-spin mdi-18px"
                        icon="sync-alt"
                        pack="fas"
                        size="is-small"
                        style="position: absolute; top: -20px; right: 18px;"
                    ></b-icon>
                    <b-icon
                        v-else
                        custom-class="mdi-18px"
                        icon="pin-outline"
                        size="is-small"
                        style="position: absolute; top: -20px; right: 18px;"
                        :type="pinColour"
                    ></b-icon>
                    <b-loading :active.sync="displayLoader" :can-cancel="true" :is-full-page="true">
                        <div id="nbrequirements-loader">
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
                backend-pagination
                backend-sorting
                paginated
                ref="table"
                aria-next-label="Next page"
                aria-previous-label="Previous page"
                aria-page-label="Page"
                aria-current-label="Current page"
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
                        sortable
                        field="package_name"
                        label="Package"
                        width="250"
                    >{{ props.row.package_name }}</b-table-column>

                    <b-table-column
                        v-if="!props.row.locked"
                        centered
                        field="constraint"
                        label="Constraint"
                        width="150"
                    >
                        <VersionField
                            v-on:select="value => update(props.row, {constraint: value})"
                            :data="props.row.releases"
                            :placeholder="props.row.constraint"
                        />
                    </b-table-column>
                    <b-table-column
                        v-else
                        centered
                        field="constraint"
                        label="Constraint"
                        width="150"
                    >{{ props.row.constraint }}</b-table-column>

                    <b-table-column field="health" label="Health" numeric sortable>
                        <span
                            class="tag"
                            style="width: 3.5em; height: 2.5em; font-size: .8em;"
                            :class="type(props.row.health)"
                        >{{ props.row.health || "?" }}</span>
                    </b-table-column>

                    <b-table-column field="actions" label="Action">
                        <div class="level" style="padding-bottom: unset;">
                            <template v-if="props.row.locked">
                                <b-button
                                    class="level-item"
                                    icon-right="pencil"
                                    size="is-medium"
                                    @click="onEdit(props.row, props.index)"
                                />
                                <b-button
                                    class="level-item"
                                    icon-right="delete-outline"
                                    size="is-medium"
                                    @click="onRemoveRequirement(props.row, props.index)"
                                />
                            </template>
                            <template v-else>
                                <b-button
                                    class="level-item"
                                    icon-right="cancel"
                                    size="is-medium"
                                    @click="onCancelEdit(props.row, props.index)"
                                />
                                <b-button
                                    disabled
                                    class="level-item"
                                    icon-right="delete-outline"
                                    size="is-medium"
                                    @click="onRemoveRequirement(props.row, props.index)"
                                />
                            </template>
                            <b-button
                                disabled
                                class="level-item"
                                icon-right="pin-outline"
                                size="is-medium"
                            />
                        </div>
                    </b-table-column>
                </template>

                <!-- Footer -->

                <template slot="footer">
                    <template v-if="newRequirement">
                        <b-table-column sortable field="package_name" label="Package" width="250">
                            <PackageField
                                v-on:error="err => hasError = err"
                                v-on:select="value => newRequirement = value"
                                placeholder="e.g. pandas"
                            />
                        </b-table-column>
                        <b-table-column centered field="constraint" label="Constraint" width="150">
                            <VersionField
                                v-on:error="err => hasError = err"
                                v-on:select="value => newRequirement.constraint = value"
                                :data="newRequirement.releases"
                                :placeholder="newRequirement.constraint || '*'"
                            />
                        </b-table-column>
                        <b-table-column field="health" label="Health" numeric sortable>
                            <span
                                class="tag"
                                style="width: 3.5em; font-size: .65em;"
                                :class="type(newRequirement.health)"
                            >{{ newRequirement.health || "?" }}</span>
                        </b-table-column>

                        <b-table-column field="actions" label="Action">
                            <div class="level" style="padding-bottom: unset;">
                                <b-button
                                    class="level-item"
                                    icon-right="cancel"
                                    size="is-medium"
                                    @click="onCancelAdd(newRequirement)"
                                />
                                <b-button
                                    disabled
                                    class="level-item"
                                    icon-right="delete-outline"
                                    size="is-medium"
                                />
                                <b-button
                                    disabled
                                    class="level-item"
                                    icon-right="pin-outline"
                                    size="is-medium"
                                />
                            </div>
                        </b-table-column>
                    </template>

                    <div v-else class="columns is-centered">
                        <b-button
                            style="margin-top:15px;"
                            icon-right="plus-circle-outline"
                            size="is-medium"
                            @click="onNewRequirement"
                        />
                    </div>
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

            <Installer v-if="!editing" :disabled="hasError" ref="installer" />
            <div v-else class="columns is-centered">
                <b-button
                    :disabled="hasError"
                    class="is-primary is-large"
                    style="margin-top: 20px;"
                    icon-left="content-save"
                    size="is-medium"
                    @click="onSave"
                >Save</b-button>
            </div>
        </b-collapse>
    </section>
</template>

<script lang="ts">
import _ from "lodash";

import { Logger } from "../config";
import { Requirements } from "../types/requirements";

import Vue from "vue";
import { mapState, mapActions } from "vuex";
import Component from "vue-class-component";

import Installer from "./components/button-install.vue";
import PackageField from "./components/field-package.vue";
import VersionField from "./components/field-version.vue";

import { PackageVersion } from "../thoth";

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
    methods: mapActions(["removeRequirement"]),
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
    computed: mapState(["data", "editing", "loading", "status"]),
    components: {
        Installer,
        PackageField,
        VersionField
    }
})
export default class UI extends BaseUI {
    // Typed
    $refs!: {
        table: any;
    };
    data!: any[]; // TODO: PyPI interface
    loading!: boolean;

    // Properties
    newData: any = null;
    updates: any[] = [];

    page: number = 1;
    perPage: number = 10;

    sortField: string = "health";
    sortOrder: string = "desc";
    defaultSortOrder: string = "desc";

    // State
    error: boolean = false;
    isExpanded: boolean = false;

    get hasError(): boolean {
        return this.error;
    }

    set hasError(on: boolean) {
        this.error = on;
    }

    get isEmpty(): boolean {
        return this.$store.state.data.length <= 0;
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

    get newRequirement(): any {
        return this.newData;
    }

    set newRequirement(data: any) {
        this.newData = data;
    }

    onNewRequirement() {
        this.newData = {
            package_name: null,
            constraint: "*",
            releases: {}
        };
        this.$store.commit("editing", true);
    }

    onPageChange(page: number) {
        this.page = page;
        // TODO: Paging
    }

    onRemoveRequirement(row: any) {
        this.removeRequirement(row.package_name);
    }

    onSave() {
        const req: Requirements = this.$store.getters.requirements;
        for (const update of this.updates) {
            const d = _.assign(update.target, update.value);

            req.packages[d.package_name] = d.constraint;
        }

        if (this.newData) {
            const dep = new PackageVersion(
                this.newData.package_name,
                this.newData.constraint
            );
            this.$store.dispatch("addRequirement", dep);
        }

        this.newData = null;

        this.$store.commit("editing", false);
        this.$store.dispatch("setRequirements", req);
    }

    onSort(field: string, order: string) {
        this.sortField = field;
        this.sortOrder = order;

        this.$store.commit("sortData", { field: field, order: order });
    }

    onCancelAdd(row: any) {
        this.newRequirement = null;
        this.$store.commit("editing", false);
    }

    onCancelEdit(row: any, index: number) {
        if (_.isUndefined(row.package_name) || !row.package_name) {
            this.$store.commit("removeByIndex", index);
        } else {
            // Discard updates for a specific row (if applicable)
            row.locked = true;

            this.updates = this.updates.filter(
                d => d.target.package_name !== row.package_name
            );
        }

        this.$store.commit("editing", false);
    }

    onEdit(row: any) {
        row.locked = false;
        this.$store.commit("editing", true);
    }

    removeRequirement!: (dep: string) => void;

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

    update(row: any, value: any) {
        this.updates.push({ target: row, value: value });
    }

    mounted() {
        this.$store.dispatch("loadData");
    }
}
</script>

<style lang="scss">
#nbrequirements-loader {
    display: flex;
    flex-direction: column;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    margin: auto;

    align-items: center;
    align-content: center;

    justify-content: center;
}

.vue-container {
    padding: 0px 30px 30px 30px;
}

::shadow {
    .help {
        font-size: 0.95rem;
    }
}

@import url(https://use.fontawesome.com/releases/v5.2.0/css/all.css);
@import url(https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css);
</style>
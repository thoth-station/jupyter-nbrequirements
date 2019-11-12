<template>
    <section class="columns is-vcentered">
        <div class="column is-5">
            <b-field label="Package" label-position="inside" custom-class="is-medium">
                <b-autocomplete
                    ref="package"
                    size="is-medium"
                    field="info.name"
                    placeholder="e.g. pandas"
                    :data="data"
                    :loading="isFetching"
                    :keep-first="true"
                    @focus.prevent="onFocusIn"
                    @blur.prevent="onFocusOut"
                    @select="onPackageSelect"
                    @typing="getAsyncData"
                >
                    <template slot-scope="props">
                        <div class="media">
                            <!-- <div class="media-left">
                            <img
                                width="32"
                                :src="``"
                            />
                            </div>-->
                            <div class="media-content">
                                {{ props.option.info.name }}
                                <br />
                                <small>{{ props.option.info.summary | truncate(80) }}</small>
                            </div>
                        </div>
                    </template>
                </b-autocomplete>
            </b-field>
        </div>

        <div class="column is-1">
            <b-field custom-class="is-medium">
                <b-select ref="versionConstraint" placeholder="constraint">
                    <option value></option>
                    <option value="==">==</option>
                    <option value="~=">~=</option>
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                </b-select>
            </b-field>
        </div>

        <div class="column is-3">
            <b-field label="Version" label-position="inside" custom-class="is-medium">
                <b-autocomplete
                    ref="version"
                    size="is-medium"
                    field="release"
                    placeholder="*"
                    :data="releases"
                    :loading="isFetching"
                    :keep-first="true"
                    :open-on-focus="true"
                    @blur.prevent="onFocusOut"
                    @focus.prevent="onFocusIn"
                    @select="onVersionSelect"
                    @typing="onTyping"
                >
                    <template slot-scope="props">
                        <div class="media">
                            <div class="media-content">
                                {{ props.option.release }}
                                <br />
                                <span
                                    class="tag is-success"
                                >{{ new Date(props.option.data.upload_time).toLocaleDateString() }}</span>
                            </div>
                        </div>
                    </template>
                </b-autocomplete>
            </b-field>
        </div>

        <div class="column is-1 is-offset-1">
            <b-button icon-right="plus-circle-outline" size="is-medium" @click="onAddPackage" />
        </div>
    </section>
</template>

<script lang="ts">
import _ from "lodash";

import axios from "axios";
import debounce from "lodash/debounce";

import Vue from "vue";
import { mapMutations, mapActions } from "vuex";

import Component from "vue-class-component";

import { PackageVersion } from "../../thoth";

// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseComponent = Vue.extend({
    props: {
        data: Array,

        selected: Object,
        placeholder: String,

        isFetching: Boolean
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
    methods: mapActions(["setRequirements"])
})
export default class PackageFinder extends BaseComponent {
    $refs!: {
        package: any;
        version: any;
        versionConstraint: any;
    };
    releaseFilter: string = ".*";

    // Package which should be added as a dependency
    selectedPackage: PackageVersion | null = null;

    mounted() {
        this.$el.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            return false;
        });
    }

    get getAsyncData() {
        return debounce(name => {
            if (!name.length) {
                this.data = [];
                return;
            }
            this.isFetching = true;

            const url = `https://pypi.org/pypi/${name}/json`;
            axios
                .get(url)
                .then(({ data }) => {
                    this.data = [data];
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

    get releases() {
        if (!this.selected) {
            return [];
        }
        const releases = Object.entries(this.selected.releases)
            .map(([k, d]: [string, any], i) => {
                return {
                    release: k,
                    data: d[0]
                };
            })
            .filter((d: any) => d.release.match(RegExp(this.releaseFilter)));

        releases.sort((a, b) => {
            const date_a = Date.parse(a.data.upload_time);
            const date_b = Date.parse(b.data.upload_time);

            if (date_a < date_b) return 1;
            else if (date_a > date_b) return -1;
            else return 0;
        });

        // matching most recent version
        releases.unshift({
            release: "*",
            data: { upload_time: new Date().toLocaleDateString() }
        });

        return releases;
    }

    get onTyping() {
        return debounce(value => {
            if (!value.length || value === "*") {
                this.releaseFilter = ".*";
            } else {
                this.releaseFilter = value;
            }
        }, 500);
    }

    onAddPackage() {
        this.$store.dispatch("addRequirement", this.selectedPackage);
        // clear the values of the autocomplete elements
        this.$refs.package.newValue = undefined;
        this.$refs.version.newValue = undefined;
    }

    onPackageSelect(option: any) {
        if (!option) return;
        this.selected = option;
        this.selectedPackage = new PackageVersion(option.info.name);
    }
    onVersionSelect(option: any) {
        if (!option) return;
        if (!this.selectedPackage) {
            throw Error("Package cannot be undefined.");
        }
        const versionConstraint = this.$refs.versionConstraint.selected || "==";
        const version =
            option.release !== "*"
                ? `${versionConstraint}${option.release}`
                : "*";
        this.selectedPackage = new PackageVersion(
            this.selectedPackage.name,
            version
        );
    }

    onFocusIn(event: Event) {
        event.stopPropagation();

        // disable keyboard manager
        Jupyter.notebook.keyboard_manager.disable();
    }

    onFocusOut() {
        // enable keyboard manager
        Jupyter.notebook.keyboard_manager.enable();
    }
}
</script>
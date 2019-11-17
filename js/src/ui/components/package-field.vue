<template>
    <section>
        <b-field
            ref="field"
            label-position="inside"
            custom-class="is-medium"
            :label="label"
            :message="{ 'Invalid or non-existing package name': hasError }"
            :type="{ 'is-danger': hasError }"
        >
            <b-autocomplete
                ref="autocomplete"
                icon="magnify"
                size="is-medium"
                field="info.name"
                :data="packages"
                :keep-first="true"
                :loading="isFetching"
                :open-on-focus="true"
                :placeholder="placeholder"
                @focus.prevent="onFocusIn"
                @blur.prevent="onFocusOut"
                @select="onSelect"
                @typing="getAsyncData"
            >
                <template slot-scope="props">
                    <div class="media">
                        <div class="media-content">
                            {{ props.option.info.name }}
                            <br />
                            <small>{{ props.option.info.summary | truncate(80) }}</small>
                        </div>
                    </div>
                </template>
            </b-autocomplete>
        </b-field>
    </section>
</template>

<script lang="ts">
import _ from "lodash";

import axios from "axios";
import debounce from "lodash/debounce";

import Vue from "vue";
import { mapMutations, mapActions } from "vuex";

import Component from "vue-class-component";
import { Emit, Watch } from "vue-property-decorator";

import { PackageVersion } from "../../thoth";

// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseComponent = Vue.extend({
    props: {
        label: String,
        placeholder: String
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
export default class PackageField extends BaseComponent {
    // Typed
    $refs!: {
        autocomplete: any;
        field: any;
    };
    label!: string;
    placeholder!: string;

    // Properties
    data: any[] = [];
    selection: any = null;

    // State
    error: boolean = true;
    fetching: boolean = false;

    get hasError(): boolean {
        return this.error;
    }

    set hasError(on: boolean) {
        this.error = on;
        this.$emit("error", on);
    }

    get isFetching(): boolean {
        return this.fetching;
    }

    set isFetching(fetching: boolean) {
        this.fetching = fetching;
    }

    get packages(): any[] {
        return this.data || [];
    }

    set packages(data: any[]) {
        this.data = data || [];
    }

    get getAsyncData() {
        return debounce(name => {
            if (!name.length) {
                this.hasError = true;

                this.packages = [];
                this.selected = null;

                return;
            }

            this.fetching = true;
            this.hasError = false;

            const url = `https://pypi.org/pypi/${name}/json`;
            axios
                .get(url)
                .then(({ data }) => {
                    this.packages = [data];
                })
                .catch(error => {
                    this.packages = [];
                    this.hasError = true;
                })
                // @ts-ignore
                .finally(() => {
                    this.fetching = false;
                });
        }, 500);
    }

    get recommendedPackage(): string | undefined {
        if (this.packages.length > 0) return this.packages[0].info.name;

        return;
    }

    get selected(): any {
        return this.selection;
    }

    set selected(selection: any) {
        if (selection) this.selection = selection;
        else
            this.selection = {
                package_name: null,
                constraint: "*"
            };
    }

    @Emit("select")
    onSelect(option: any) {
        if (!option) {
            this.selected = null;
            this.hasError = true;
        } else {
            const packageData = {
                constraint: "*",
                health: (Math.random() * 10).toPrecision(2), // TODO
                latest: _.get(option.info, "version"),
                locked: false,
                package_name: _.get(option.info, "name"),
                summary: _.get(option.info, "summary"),
                releases: _.get(option, "releases", {})
            };

            this.selected = packageData;
        }

        return this.selected;
    }

    onFocusIn(event: Event) {
        event.stopPropagation();

        // disable keyboard manager
        Jupyter.notebook.keyboard_manager.disable();
    }

    onFocusOut() {
        // enable keyboard manager
        Jupyter.notebook.keyboard_manager.enable();

        // trigger select to store current selection
        const selectedPackage = this.$refs.autocomplete.newValue;

        let packageData = null;
        for (const p of this.data) {
            if (p.package_name === selectedPackage) packageData = p;
        }

        if (!packageData && selectedPackage) {
            // Query once more (for quickly typing users)
            const url = `https://pypi.org/pypi/${selectedPackage}/json`;
            axios
                .get(url)
                .then(({ data }) => {
                    this.onSelect(data);
                    this.hasError = false;
                })
                .catch(error => {
                    this.hasError = true;
                });
        }
    }

    mounted() {
        // search and alert icons
        const icons = this.$refs.autocomplete.$el.querySelectorAll(".mdi");
        for (const icon of icons) {
            icon.className = icon.className.replace(/mdi-(\d+)px/, "mdi-18px");
        }

        this.$el.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            return false;
        });
    }

    updated() {
        const icons = this.$refs.autocomplete.$el.querySelectorAll(".mdi");
        for (const icon of icons) {
            icon.className = icon.className.replace(/mdi-(\d+)px/, "mdi-18px");
        }
    }
}
</script>
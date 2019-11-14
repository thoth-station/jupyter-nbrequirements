<template>
    <section>
        <b-field :label="label" label-position="inside" custom-class="is-medium">
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

import { PackageVersion } from "../../thoth";

// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseComponent = Vue.extend({
    props: {
        label: String,

        selected: Object,
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
    };
    label!: string;

    // Properties
    data: any[] = [];

    // State
    fetching: boolean = false;
    selectedPackage: PackageVersion | null = null;

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
                this.packages = [];
                return;
            }
            this.isFetching = true;

            const url = `https://pypi.org/pypi/${name}/json`;
            axios
                .get(url)
                .then(({ data }) => {
                    this.packages = [data];
                })
                .catch(error => {
                    this.packages = [];
                    throw error;
                })
                // @ts-ignore
                .finally(() => {
                    this.isFetching = false;
                });
        }, 500);
    }

    get recommendedPackage(): string | undefined {
        if (this.packages.length > 0) return this.packages[0].info.name;

        return;
    }

    onSelect(option: any) {
        if (!option) return;
        this.selected = option;
        this.selectedPackage = new PackageVersion(option.info.name);
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

    mounted() {
        const icon = this.$refs.autocomplete.$el.querySelector(".mdi");

        icon.className = icon.className.replace(/mdi-(\d+)px/, "mdi-18px");

        this.$el.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            return false;
        });
    }
}
</script>
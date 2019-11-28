<template>
    <section>
        <b-field
            ref="field"
            label-position="inside"
            custom-class="is-medium"
            :label="label"
            :message="{
                'Version range is too wide': hasWarning,
                'Invalid or non-existing version': hasError
            }"
            :type="{ 'is-danger': hasError, 'is-warning': hasWarning }"
        >
            <b-autocomplete
                ref="autocomplete"
                size="is-medium"
                field="release"
                :data="releases"
                :loading="isFetching"
                :keep-first="true"
                :open-on-focus="releases.length > 1"
                :placeholder="placeholder"
                @blur.prevent="onFocusOut"
                @focus.prevent="onFocusIn"
                @select="onSelect"
                @typing="onTyping"
            >
                <template slot-scope="props">
                    <div ref="suggestions" class="media">
                        <div class="media-content">
                            {{ props.option.release }}
                            <br />
                            <span
                                class="tag is-success"
                            >{{ props.option.data ? new Date(props.option.data.upload_time).toLocaleDateString() : "unkwnown" }}</span>
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
import { mapMutations, mapActions, mapState } from "vuex";

import Component from "vue-class-component";
import { Emit, Watch } from "vue-property-decorator";

import { PackageVersion } from "../../thoth";

// @ts-ignore
import Jupyter = require("base/js/namespace");

@Component({
    props: {
        data: Object,

        label: String,
        placeholder: String
    }
})
export default class VersionField extends Vue {
    // Typed
    $refs!: {
        autocomplete: any;
        field: any;
    };

    data!: any;
    label!: string;
    placeholder!: string;

    // Properties
    filter: string = ".*";
    selection: string | null = "*";

    // State
    error: boolean = false;
    warning: boolean = false;

    fetching: boolean = false;

    get hasError(): boolean {
        return !this.data || this.error;
    }

    set hasError(on: boolean) {
        this.error = on;
        this.$emit("error", on);
    }

    get hasWarning(): boolean {
        return !this.hasError && (this.warning || this.releaseFilter === ".*");
    }

    set hasWarning(on: boolean) {
        this.warning = on;
        this.$emit("warning", on);
    }

    get isFetching(): boolean {
        return this.fetching;
    }

    set isFetching(fetching: boolean) {
        this.fetching = fetching;
    }

    get releaseFilter(): string {
        return this.filter;
    }

    set releaseFilter(filter: string) {
        this.filter = filter;
    }

    get releases() {
        if (!this.data) {
            return [];
        }
        let releases = Object.entries(this.data)
            .map(([k, d]: [string, any], i) => {
                return {
                    release: k,
                    data: d[0]
                };
            })
            .filter(
                (d: any) =>
                    d.release.match(RegExp(this.releaseFilter)) &&
                    !_.isUndefined(d.data)
            );

        releases = _.sortBy(releases, d =>
            Date.parse(_.get(d, "data.upload_time"))
        ).reverse();

        if (releases.length <= 0) {
            this.hasError = true;
            return [];
        }

        // matching most recent version
        if (this.releaseFilter === ".*")
            releases.unshift({
                release: "*",
                data: { upload_time: new Date().toLocaleDateString() }
            });

        this.hasError = false;

        return releases;
    }

    get selected(): string | null {
        return this.selection;
    }

    set selected(selection: string | null) {
        this.selection = selection;
    }

    @Emit("select")
    onSelect(option: any) {
        if (!option) {
            this.selected = null;
            return;
        }

        this.selected = option.release as string;

        if (this.selected.length <= 0 || this.selected === "*") {
            this.releaseFilter = ".*";
            this.hasWarning = true;
        } else {
            this.releaseFilter = this.selected;
        }

        const op = this.selected === "*" ? "" : "=="; // TODO: dropdown control

        return `${op}${this.selected}`;
    }

    onTyping(value: string) {
        if (!value.length || value === "*") {
            this.releaseFilter = ".*";
        } else {
            this.releaseFilter = value;
        }
    }

    onFocusIn(event: Event) {
        event.stopPropagation();

        // disable keyboard manager
        Jupyter.notebook.keyboard_manager.disable();
    }

    onFocusOut() {
        // enable keyboard manager
        Jupyter.notebook.keyboard_manager.enable();

        setTimeout(() => {
            const value = this.$refs.autocomplete.newValue;
            if (value !== this.selected) {
                const data = this.releases.filter(d => d.release === value);
                if (data.length <= 0) {
                    this.hasError = true;
                }
            }
        }, 500);
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
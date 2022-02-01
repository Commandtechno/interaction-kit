/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import type { Snowflake } from "./snowflakes";
import type { GuildMember } from "./guild-members";
import { User } from "./users";
import { AllowedMentions, Channel, ChannelType } from "./channels";
import { Embed } from "./embeds";
import { Role } from "./roles";
import { Component, ComponentType, SelectOption } from "./components";
import { Message } from "./messages";
import { PartialAttachment } from "./attachments";

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure */
export type ApplicationCommand = {
	id: Snowflake;
	type?: ApplicationCommandType;
	application_id: Snowflake;
	guild_id?: Snowflake;
	name: string;
	description?: string;
	options?: ApplicationCommandOption[];
	default_permission?: boolean;
	version?: Snowflake;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types */
export enum ApplicationCommandType {
	CHAT_INPUT = 1,
	USER = 2,
	MESSAGE = 3,
}

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure */
export type BaseApplicationCommandOption = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
};

export type ChannelApplicationCommandOption = BaseApplicationCommandOption & {
	type: ApplicationCommandOptionType.CHANNEL;
	channel_types?: ChannelType[];
};

export type ApplicationCommandOptionWithChoice =
	BaseApplicationCommandOption & {
		type:
			| ApplicationCommandOptionType.STRING
			| ApplicationCommandOptionType.INTEGER
			| ApplicationCommandOptionType.NUMBER;
		choices?: ApplicationCommandOptionChoice[];
		autocomplete?: boolean;
	};

export type NumericApplicationCommandOption =
	ApplicationCommandOptionWithChoice & {
		type:
			| ApplicationCommandOptionType.NUMBER
			| ApplicationCommandOptionType.INTEGER;
		min_value?: number;
		max_value?: number;
	};

export type SubCommandApplicationCommandOption =
	BaseApplicationCommandOption & {
		type: ApplicationCommandOptionType.SUB_COMMAND;
		options?: Array<
			Exclude<
				ApplicationCommandOption,
				| SubCommandGroupApplicationCommandOption
				| SubCommandApplicationCommandOption
			>
		>;
	};

export type SubCommandGroupApplicationCommandOption =
	BaseApplicationCommandOption & {
		type: ApplicationCommandOptionType.SUB_COMMAND_GROUP;
		options?: SubCommandApplicationCommandOption[];
	};

export type ApplicationCommandOption =
	| SubCommandGroupApplicationCommandOption
	| SubCommandApplicationCommandOption
	| NumericApplicationCommandOption
	| ApplicationCommandOptionWithChoice
	| ChannelApplicationCommandOption
	| BaseApplicationCommandOption;

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type */
export enum ApplicationCommandOptionType {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
	NUMBER = 10,
}

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure */
export type ApplicationCommandOptionChoice = {
	name: string;
	value: string | number;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object */
export type GuildApplicationCommandPermissions = {
	id: Snowflake;
	application_id: Snowflake;
	guild_id: Snowflake;
	permissions: ApplicationCommandPermissions[];
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure */
export type ApplicationCommandPermissions = {
	id: Snowflake;
	type: ApplicationCommandPermissionType;
	permission: boolean;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type */
export enum ApplicationCommandPermissionType {
	ROLE = 1,
	USER = 2,
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure */
export type Interaction = {
	id: Snowflake;
	application_id: Snowflake;
	type: InteractionRequestType;
	data?: ApplicationCommandInteractionData;
	guild_id?: Snowflake;
	channel_id?: Snowflake;
	member?: GuildMember;
	user?: User;
	token: string;
	version: number;
	message?: Message;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type */
export enum InteractionRequestType {
	PING = 1,
	APPLICATION_COMMAND = 2,
	MESSAGE_COMPONENT = 3,
	APPLICATION_COMMAND_AUTOCOMPLETE = 4,
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data-structure */
export type ApplicationCommandInteractionData = {
	id: Snowflake;
	type: ApplicationCommandType;
	name: string;
	resolved?: ApplicationCommandInteractionDataResolved;
	options?: ApplicationCommandInteractionDataOption[];
	custom_id?: string;
	component_type?: ComponentType;
	target_id?: Snowflake;
	value?: Array<SelectOption["value"]>;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure */
export type ApplicationCommandInteractionDataResolved = {
	users?: Record<Snowflake, User>;
	members?: Record<Snowflake, Omit<GuildMember, "user" | "deaf" | "mute">>;
	roles?: Record<Snowflake, Role>;
	channels?: Record<
		Snowflake,
		Pick<Channel, "id" | "name" | "type" | "permissions">
	>;
	messages?: Record<Snowflake, Message>;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-interaction-data-option-structure */
export type ApplicationCommandInteractionDataOption = {
	name: string;
	type: ApplicationCommandOptionType;
	value?: ApplicationCommandInteractionDataOptionValueType;
	options?: ApplicationCommandInteractionDataOption[];
	focused?: boolean;
};

// HACK: This is to fix typechecking
// this should be ApplicationCommandInteractionDataOptionValueType but when changing it to that some other stuff doesnt want to work any more so I left it like that but added the proper tybe below
export type OptionType = unknown;

// to type the value above
export type ApplicationCommandInteractionDataOptionValueType =
	| string
	| number
	| boolean
	| Snowflake;

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-response-structure */
// TODO: Check?
export type InteractionResponse = {
	type: InteractionCallbackType;
	data?: InteractionApplicationCommandCallbackData;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type */
export enum InteractionCallbackType {
	PONG = 1,
	CHANNEL_MESSAGE_WITH_SOURCE = 4,
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
	DEFERRED_UPDATE_MESSAGE = 6,
	UPDATE_MESSAGE = 7,
	APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages */
export type InteractionApplicationCommandCallbackData = {
	tts?: boolean;
	content?: string;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	flags?: InteractionCallbackDataFlags;
	components?: Component[];
	attachments?: PartialAttachment[];
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-flags */
export enum InteractionCallbackDataFlags {
	EPHEMERAL = 1 << 6,
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#message-interaction-object-message-interaction-structure */
export type MessageInteraction = {
	id: Snowflake;
	type: InteractionRequestType;
	name: string;
	user: User;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete */
export type InteractionResponseObjectAutocomplete = {
	choices: ApplicationCommandOptionChoice[];
};

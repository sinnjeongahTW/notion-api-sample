require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const members = process.env.MEMBERS.trim().split(',') || new Array(3).fill((x, idx) => `user ${idx+1}`);
const title = process.env.TITLE || 'TITLE';
const heading1 = process.env.HEADING_1 || 'HEADING_1';
const heading2 = process.env.HEADING_2 || 'HEADING_2';

(async () => {
	const nowDate = new Date()
		.toLocaleDateString()
		.substring(0, 11)
		.split('. ')
		.map((x) => (x.length === 1 ? `0${x}` : x))
		.join('-');

	const response = await notion.pages.create({
		icon: {
			type: 'emoji',
			emoji: '🥬',
		},
		parent: {
			type: 'database_id',
			database_id: process.env.NOTION_PARENT_DATABASE_ID,
		},
		properties: {
			Name: {
				title: [
					{
						type: 'mention',
						mention: {
							type: 'date',
							date: {
								start: nowDate,
								end: null,
								time_zone: null,
							},
						},
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: true,
							code: false,
							color: 'default',
						},
					},
					{
						text: {
							content: ` ${title}`,
						},
					},
				],
			},
		},
	});
	
	const children = [
		{
			paragraph: {
				rich_text: [],
				color: 'default',
			},
		},
		{
			heading_1: {
				rich_text: [
					{
						type: 'text',
						text: {
							content: heading2,
							link: null,
						},
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: 'default',
						},
					},
				],
				color: 'default',
			},
		},
	];

	members.forEach((x) => {
		children.push({
			callout: {
				rich_text: [
					{
						type: 'text',
						text: {
							content: x,
							link: null,
						},
						annotations: {
							bold: true,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: 'default',
						},
						plain_text: x,
						href: null,
					},
				],
				icon: {
					type: 'emoji',
					emoji: '💬',
				},
				color: 'gray_background',
			},
		});
	});

	const blockId = response.id;

	await notion.databases.create({
		parent: {
			type: 'page_id',
			page_id: blockId,
		},
		is_inline: true,
		title: [
			{
				type: 'text',
				text: {
					content: heading1,
					link: null,
				},
				annotations: {
					bold: false,
					italic: false,
					strikethrough: false,
					underline: false,
					code: false,
					color: 'default',
				},
			},
		],
		properties: {
			Status: {
				name: 'Status',
				type: 'status',
				status: {},
			},
			Assign: {
				name: 'Assign',
				type: 'people',
				people: {},
			},
			Name: {
				name: 'Name',
				type: 'title',
				title: {},
			},
		},
	});

	await notion.blocks.children.append({
		block_id: blockId,
		children,
	});

})();
